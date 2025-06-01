import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CalendarCheck,
  Lightning,
  MagnifyingGlass,
  ChatCircle,
} from '@/theme/icons';
import { Text } from 'react-native-gesture-handler';
import { DotIconWrapper } from '@/components/ui/DotIconWrapper';
import { useSwapNotifications } from '@/app/hooks/useSwapNotifications';
import { useUnreadMessages } from '@/app/hooks/useUnreadMessages';
import { trackEvent } from '../hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

type TabItem = {
  name: string;
  label: string;
  route: string;
  icon: any;
  trackEvent: () => void;
};

const tabs: TabItem[] = [
  { name: 'Calendar', label: 'Calendario', route: 'Calendar', icon: CalendarCheck, trackEvent: () => trackEvent(EVENTS.CALENDAR_TAB_CLICKED) },
  { name: 'HospitalShifts', label: 'Turnos', route: 'HospitalShifts', icon: MagnifyingGlass, trackEvent: () => trackEvent(EVENTS.HOSPITAL_SHIFTS_TAB_CLICKED) },
  { name: 'MySwaps', label: 'Cambios', route: 'MySwaps', icon: Lightning, trackEvent: () => trackEvent(EVENTS.MY_SWAPS_TAB_CLICKED) },
  { name: 'ChatsList', label: 'Mensajes', route: 'ChatsList', icon: ChatCircle, trackEvent: () => trackEvent(EVENTS.CHATS_LIST_TAB_CLICKED) },
];

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();


  const { hasUnreadMessages } = useUnreadMessages();
  const { hasPendingSwaps } = useSwapNotifications();

  return (
    <View style={styles.container}>
      {tabs.map(({ name, label, route: routeName, icon: Icon }) => {
        const isActive = route.name === routeName;

        let showDot = false;
        if (routeName === 'ChatsList') showDot = hasUnreadMessages;
        if (routeName === 'MySwaps') showDot = hasPendingSwaps;

        return (
          <Pressable
            key={name}
            style={styles.tab}
            onPress={() => navigation.navigate(routeName as never)}
          >
            <DotIconWrapper showDot={showDot}>
              <Icon
                size={24}
                color={isActive ? '#111' : '#999'}
                weight={isActive ? 'fill' : 'regular'}
              />
            </DotIconWrapper>
            <Text
              style={{
                color: isActive ? '#111' : '#999',
                fontSize: 12,
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
});
