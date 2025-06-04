import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppLoader from '@/components/ui/AppLoader';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useSwapApi } from '@/api/useSwapApi';
import { shiftTypeLabels, swapStatusLabels } from '@/utils/useLabelMap';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { spacing } from '@/styles';
import InputField from '@/components/forms/InputField';
import InputFieldArea from '@/components/forms/InputFieldArea';
import FadeInView from '@/components/animations/FadeInView';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function SwapDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { accessToken, isWorker } = useAuth();
  const { getSwapById, respondToSwap, cancelSwap } = useSwapApi();

  const [swap, setSwap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { swapId } = route.params as { swapId: string };

  useEffect(() => {
    const fetchSwap = async () => {
      const result = await getSwapById(swapId, accessToken);
      setSwap(result);
      setLoading(false);
    };
    fetchSwap();
  }, [swapId]);

  const iAmRequester = isWorker.worker_id === swap?.requester_id;
  const iAmReceiver = isWorker.worker_id === swap?.shift?.worker?.worker_id;

  const handleRespond = async (decision: 'accepted' | 'rejected') => {
    decision === 'accepted' ? setIsAccepting(true) : setIsRejecting(true);
    try {
      await respondToSwap(swap.swap_id, decision, accessToken);
      Alert.alert('Éxito', `Intercambio ${decision === 'accepted' ? 'aceptado' : 'rechazado'} correctamente`);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsAccepting(false);
      setIsRejecting(false);
    }
  };

  const handleCancelSwap = async () => {
    setIsCancelling(true);
    try {
      await cancelSwap(swap.swap_id, accessToken);
      Alert.alert('Intercambio anulado');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading || !swap) return <AppLoader message='Cargando detalles del intercambio...' />;

  return (
    <FadeInView>
      <SimpleLayout title="Detalle del intercambio" showBackButton onBack={() => navigation.goBack()}>
        <ScrollView contentContainerStyle={styles.container}>
          <InputField
            label="Turno original"
            value={`${formatFriendlyDate(swap.shift?.date)} de ${shiftTypeLabels[swap.shift?.shift_type]}`}
            editable={false}
            disabled
          />

          {swap.swap_type === 'return' && (
            <InputField
              label="Turno ofrecido"
              value={`${formatFriendlyDate(swap.offered_date)} de ${shiftTypeLabels[swap.offered_type]}`}
              editable={false}
              disabled
            />
          )}

          {swap.swap_type === 'no_return' && (
            <InputField
              label="Tipo de intercambio"
              value="Sin devolución"
              editable={false}
              disabled
            />
          )}

          <InputField
            label="Solicitado por"
            value={`${swap.requester.name} ${swap.requester.surname}`}
            editable={false}
            disabled
          />
          <InputField
            label="Estado"
            value={swapStatusLabels[swap.status]}
            editable={false}
            disabled
          />

          <InputFieldArea
            label="Comentarios"
            value={`${swap.swap_comments || 'Sin comentarios'}`}
            editable={false}
            multiline
            disabled
          />



          {swap.status === 'proposed' && iAmReceiver && (
            <View style={styles.actions}>
              <Button
                label="Aceptar"
                size='lg'
                variant='primary'
                onPress={() => {
                  handleRespond('accepted');
                  trackEvent(EVENTS.ACCEPT_SWAP_BUTTON_CLICKED, { swapId: swapId });
                }}
                style={{ marginTop: spacing.sm }}
                disabled={isAccepting} />
              <Button
                label="Rechazar"
                size='lg'
                variant='outline'
                style={{ marginTop: spacing.sm }}
                onPress={() => {
                  handleRespond('rejected');
                  trackEvent(EVENTS.REJECT_SWAP_BUTTON_CLICKED, { swapId: swapId });
                }}
                disabled={isRejecting} />
            </View>
          )}

          {swap.status === 'proposed' && iAmRequester && (
            <Button
              label="Anular intercambio"
              size='lg'
              variant='outline'
              style={{ marginTop: spacing.md }}
              onPress={() => {
                handleCancelSwap();
                trackEvent(EVENTS.CANCEL_SWAP_BUTTON_CLICKED, { swapId: swapId });
              }}
              disabled={isCancelling} />
          )}
        </ScrollView>
      </SimpleLayout>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
});
