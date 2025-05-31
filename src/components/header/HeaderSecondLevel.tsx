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
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: RightAction;
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.sideLeft}>
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

      <View style={styles.titleWrapper}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
      </View>

      <View style={styles.sideRight}>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
    position: 'relative',
  },
  sideLeft: {
    position: 'absolute',
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideRight: {
    position: 'absolute',
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
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
