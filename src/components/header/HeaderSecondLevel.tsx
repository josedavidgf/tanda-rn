import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/components/ui/AppText';
import { spacing, colors } from '@/styles';

type RightAction = {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
};

export default function HeaderSecondLevel({
  title,
  showBackButton = true,
  onBack,
  rightAction,
}: {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: RightAction;
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBackButton && (
          <Pressable
            onPress={onBack || (() => navigation.goBack())}
            style={styles.backButton}
          >
            <CaretLeft size={20} weight="bold" color={colors.text.primary} />
            <AppText variant="p">Atrás</AppText>
          </Pressable>
        )}
      </View>

      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.side}>
        {rightAction && (
          <Pressable
            onPress={rightAction.onPress}
            style={styles.rightAction}
            accessibilityLabel={rightAction.label}
          >
            <AppText variant="p">{rightAction.label}</AppText>
            {rightAction.icon && <View style={styles.rightIcon}>{rightAction.icon}</View>}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  title: {
    flexShrink: 1,
    textAlign: 'center',
  },
  side: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
});