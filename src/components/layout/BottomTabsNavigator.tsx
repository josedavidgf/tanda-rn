import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '@/app/screens/CalendarScreen';
import HospitalShiftsScreen from '@/app/screens/HospitalShiftsScreen';
import MySwapsScreen from '@/app/screens/MySwapScreen';
import ChatListScreen from '@/app/screens/ChatListScreen';

import {
  CalendarCheck,
  Lightning,
  MagnifyingGlass,
  ChatCircle,
} from '../../theme/icons'; // importar iconos de ../../theme/icons

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 64,
          borderTopColor: '#e5e5e5',
        },
        tabBarIcon: ({ color, focused }) => {
          const iconSize = 24;
          const weight = focused ? 'fill' : 'regular';

          switch (route.name) {
            case 'Calendar':
              return <CalendarCheck color={color} size={iconSize} weight={weight} />;
            case 'HospitalShifts':
              return <MagnifyingGlass color={color} size={iconSize} weight={weight} />;
            case 'MySwaps':
              return <Lightning color={color} size={iconSize} weight={weight} />;
            case 'ChatsList':
              return <ChatCircle color={color} size={iconSize} weight={weight} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="HospitalShifts" component={HospitalShiftsScreen} />
      <Tab.Screen name="MySwaps" component={MySwapsScreen} />
      <Tab.Screen name="ChatsList" component={ChatListScreen} />
    </Tab.Navigator>
  );
}
