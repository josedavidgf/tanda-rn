import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button'; // Asegúrate de que este es tu botón
import { spacing } from '@/styles';

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nada que mostrar',
  description = '',
  ctaLabel = '',
  onCtaClick,
}) => {
  return (
    <View style={styles.container}>
      {/* Si luego decides usar imagen/logo, añade aquí */}
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      {!!ctaLabel && onCtaClick && (
        <Button
          label={ctaLabel}
          onPress={onCtaClick}
          size="lg"
          variant="primary"
        />
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
