import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useIsWorkerReady } from '@/app/hooks/useIsWorkerReady';
import { useCalendarCommentApi } from '@/api/useCalendarCommentApi';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing, colors, typography } from '@/styles';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { useToast } from '../hooks/useToast';

export default function CommentEditorScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { accessToken, isWorker } = useAuth();
  const { getCommentByDate, upsertComment, deleteComment, loading } = useCalendarCommentApi();
  const { showError, showSuccess } = useToast();

  const dateStr: string = route.params?.date;
  const dateFormatted = formatFriendlyDate(dateStr);

  const [comment, setComment] = useState('');
  const [originalCommentId, setOriginalCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!isWorker?.worker_id || !accessToken) return;

    const loadComment = async () => {
      const result = await getCommentByDate(isWorker.worker_id, dateStr, accessToken);
      if (result) {
        setComment(result.comment);
        setOriginalCommentId(result.comment_id);
      }
    };

    loadComment();
  }, [isWorker, dateStr]);

  const handleSave = async () => {
    if (!isWorker?.worker_id || !accessToken) return;

    console.log('workerId:', isWorker.worker_id);
    console.log('dateStr:', dateStr);
    console.log('comment:', comment);

    const result = await upsertComment({ workerId: isWorker.worker_id, date: dateStr, comment }, accessToken);
    console.log('upsertComment result:', result);
    if (result && result.comment_id) {
      showSuccess('Comentario guardado correctamente');
    } else {
      console.error('[ERROR]', result);
      showError('Error al guardar el comentario');
    }

  };

  const handleDelete = async () => {
    if (!originalCommentId || !accessToken) return;

    Alert.alert('Eliminar comentario', '¿Estás seguro de que quieres eliminar este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteComment(originalCommentId, accessToken);
          if (success) {
            setComment('');
            setOriginalCommentId(null);
            showSuccess('Comentario eliminado correctamente');
            navigation.goBack();
          } else {
            showError('Error al eliminar el comentario');
          }
        },
      },
    ]);
  };

  return (


    <SimpleLayout title="Notas del día" showBackButton>
      <View style={{ padding: 16, flex: 1 }}>
        <AppText style={{ marginBottom: 8 }}>{dateFormatted}</AppText>
        <TextInput
          multiline
          value={comment}
          onChangeText={setComment}
          placeholder="Escribe algo para este día..."
          style={{
            borderColor: colors.gray[300],
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            minHeight: 120,
            textAlignVertical: 'top',
            backgroundColor: 'white',
          }}
          editable={!loading}
        />
        <View style={styles.buttonGroup}>
          <Button
            label="Guardar"
            size='lg'
            variant="primary"
            onPress={handleSave}
            disabled={loading}
          />
          {originalCommentId && (
            <Button
              label="Eliminar"
              size='lg'
              variant="outline"
              onPress={handleDelete}
            />
          )}
        </View>
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  buttonGroup: {
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
});
