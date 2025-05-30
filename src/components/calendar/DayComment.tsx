import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/ui/Button';

export default function CommentButton({ dateStr }: { dateStr: string }) {
  const navigation = useNavigation();

  return (
    <Button
      label="Comentario del día"
      variant="outline"
      size="lg"
      onPress={() => navigation.navigate('CommentEditor', { date: dateStr })}
    />
  );
}
