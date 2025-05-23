import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CalendarCheck,
  Lightning,
  MagnifyingGlass,
  ChatCircle,
} from '@/theme/icons';
import { Text } from 'react-native-gesture-handler';

type TabItem = {
  name: string;
  label: string;
  route: string;
  icon: any;
};

const tabs: TabItem[] = [
  { name: 'Calendar', label: 'Calendario', route: 'Calendar', icon: CalendarCheck },
  { name: 'HospitalShifts', label: 'Turnos', route: 'HospitalShifts', icon: MagnifyingGlass },
  { name: 'MySwaps', label: 'Cambios', route: 'MySwaps', icon: Lightning },
  { name: 'ChatsList', label: 'Mensajes', route: 'ChatsList', icon: ChatCircle },
];

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {tabs.map(({ name, label, route: routeName, icon: Icon }) => {
        const isActive = route.name === routeName;

        return (
          <Pressable
            key={name}
            style={styles.tab}
            onPress={() => navigation.navigate(routeName as never)}
          >
            <Icon
              size={24}
              color={isActive ? '#111' : '#999'}
              weight={isActive ? 'fill' : 'regular'}
            />
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
