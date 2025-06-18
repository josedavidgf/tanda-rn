// components/ContentCardBanner.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AppText from './AppText';
import { spacing, colors } from '@/styles';
import * as PhosphorIcons from 'phosphor-react-native';

export type ContentCard = {
  id: string;
  title: string;
  description?: string;
  icon_name?: string;
  cta_url?: string;
  cta_text?: string;
};

type Props = {
  card: ContentCard;
  onDismiss: (id: string) => void;
};

export const ContentCardBanner = ({ card, onDismiss }: Props) => {
  if (!card) return null;

  const IconComponent = card.icon_name ? PhosphorIcons[card.icon_name] : null;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {IconComponent && (
          <IconComponent size={32} color={colors.primary} style={styles.icon} />
        )}

        <View style={styles.textContainer}>
          <AppText variant="h3" style={styles.title}>{card.title}</AppText>
          {card.description && (
            <AppText variant="p" style={styles.description}>{card.description}</AppText>
          )}
          {card.cta_url && card.cta_text && (
            <AppText variant='link' style={styles.ctaLink} onPress={() => Linking.openURL(card.cta_url)}>
              {card.cta_text}
            </AppText>
          )}
        </View>

        <TouchableOpacity onPress={() => onDismiss(card.id)}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  close: {
    fontSize: 20,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  ctaLink: {
    marginTop: spacing.sm,
  },
});
