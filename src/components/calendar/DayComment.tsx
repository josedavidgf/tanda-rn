import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { PencilSimple } from 'phosphor-react-native';

export default function CommentButton({ dateStr }: { dateStr: string }) {
  const navigation = useNavigation();

  return (
    <Button
      label="Notas"
      leftIcon={<PencilSimple size={20} />}
      variant="ghost"
      size="sm"
      onPress={() => {
        navigation.navigate('CommentEditor', { date: dateStr });
        trackEvent(EVENTS.COMMENT_BUTTON_CLICKED, { date: dateStr });
      }}
    />
  );
}