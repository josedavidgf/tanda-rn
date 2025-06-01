import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function CommentButton({ dateStr }: { dateStr: string }) {
  const navigation = useNavigation();

  return (
    <Button
      label="Comentario del día"
      variant="outline"
      size="lg"
      onPress={() => {
        navigation.navigate('CommentEditor', { date: dateStr });
        trackEvent(EVENTS.COMMENT_BUTTON_CLICKED, { date: dateStr });
      }}
    />
  );
}