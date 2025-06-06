import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { PencilLine, PencilSimple } from 'phosphor-react-native';

export default function CommentButton({ dateStr }: { dateStr: string }) {
  const navigation = useNavigation();

  return (
    <Button 
      label={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PencilLine size={20} />
          <Text style={{ marginLeft: 4 }}>Notas</Text>
        </View>
      }
      leftIcon={undefined}
      variant="ghost"
      size="sm"
      onPress={() => {
        navigation.navigate('CommentEditor', { date: dateStr });
        trackEvent(EVENTS.COMMENT_BUTTON_CLICKED, { date: dateStr });
      }}
    />
  );
}