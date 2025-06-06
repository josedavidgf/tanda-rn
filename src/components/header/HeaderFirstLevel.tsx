import { View, StyleSheet, Pressable } from 'react-native';
import { User, ChartBar } from 'phosphor-react-native';
import AppText from '../ui/AppText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { spacing, colors, typography } from '@/styles';
import NotificationDotIcon from '@/components/ui/NotificationDotIcon';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function HeaderFirstLevel({ title }: { title: string }) {
  const navigation = useNavigation();
  const route = useRoute();

  const isCalendarScreen = route.name === 'Calendar';

  return (
    <View style={styles.container}>
      <AppText variant='h2'>{title}</AppText>
      {isCalendarScreen && (
        <View style={styles.actions}>
          <Pressable onPress={() => {
            navigation.navigate('Stats');
            trackEvent(EVENTS.STATS_BUTTON_CLICKED);
          }}>
            <ChartBar size={24} weight="regular" color={colors.gray[800]} />
          </Pressable>
          <Pressable onPress={() => {
            navigation.navigate('ActivityList');
            trackEvent(EVENTS.ACTIVITY_LIST_BUTTON_CLICKED);
          }}>
            <NotificationDotIcon />
          </Pressable>
          <Pressable onPress={() => {
            navigation.navigate('ProfileMenu');
            trackEvent(EVENTS.PROFILE_MENU_BUTTON_CLICKED);
          }}>
            <User size={24} weight="regular" color={colors.gray[800]} />
          </Pressable>
        </View>
      )}
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
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
