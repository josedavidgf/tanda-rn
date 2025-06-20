// app/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// First Level
import CalendarScreen from '../screens/CalendarScreen';
import HospitalShifts from '../screens/HospitalShiftsScreen'
import ChatsList from '../screens/ChatListScreen';
import MySwaps from '../screens/MySwapScreen';
// Second Level
import CreateShift from '../screens/CreateShiftScreen'; // ajusta la ruta si hace falta
import ProposeSwap from '../screens/ProposeSwapScreen';
import SwapDetails from '../screens/SwapDetailsScreen';
import ChatPage from '../screens/ChatPageScreen';
import ActivityList from '../screens/ActivityListScreen';
import Stats from '../screens/StatsScreen';

// Onboarding
import OnboardingCode from '../screens/OnboardingCodeScreen';
import OnboardingConfirm from '../screens/OnboardingConfirmScreen';
import OnboardingSpeciality from '../screens/OnboardingSpecialityScreen';
import OnboardingName from '../screens/OnboardingNameScreen';
import OnboardingPhone from '../screens/OnboardingPhoneScreen';
import OnboardingSuccess from '../screens/OnboardingSuccessScreen';

// Profile
import ProfileMenu from '../screens/ProfileMenuScreen';
import ProfileWorkingInfo from '../screens/ProfileWorkingInfoScreen';
import ProfilePersonalInfo from '../screens/ProfilePersonalInfoScreen';
import ProfilePreferences from '../screens/ProfilePreferencesScreen';
import ProfileContactSupport from '../screens/ProfileContactScreen';
import ProfileResetPassword from '../screens/ProfileResetPasswordScreen';
import ProfileReferral from '../screens/ProfileReferralScreen'; // si la tienes, sino elimina esta línea
import ProfileDeleteAccount from '../screens/ProfileDeleteAccountScreen'; // si la tienes, sino elimina esta línea

// Rest
import CommentEditorScreen from '../screens/CommentEditorScreen';
import EditShiftScreen from '../screens/EditShiftScreen';
import ShiftHoursSettings from '../screens/ShiftHoursSettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="ActivityList" component={ActivityList} />
      <Stack.Screen name="CreateShift" component={CreateShift} />
      <Stack.Screen name='HospitalShifts' component={HospitalShifts} />
      <Stack.Screen name='MySwaps' component={MySwaps} />
      <Stack.Screen name='ChatsList' component={ChatsList} />
      <Stack.Screen name='ShiftHoursSettings' component={ShiftHoursSettings} />
      <Stack.Screen name='Stats' component={Stats} />
      <Stack.Screen name='ProposeSwap' component={ProposeSwap} />
      <Stack.Screen name='EditShift' component={EditShiftScreen} />
      <Stack.Screen name='SwapDetails' component={SwapDetails} />
      <Stack.Screen name='ChatPage' component={ChatPage} />
      <Stack.Screen name='OnboardingCode' component={OnboardingCode} />
      <Stack.Screen name='OnboardingConfirm' component={OnboardingConfirm} />
      <Stack.Screen name='OnboardingSpeciality' component={OnboardingSpeciality} />
      <Stack.Screen name='OnboardingName' component={OnboardingName} />
      <Stack.Screen name='OnboardingPhone' component={OnboardingPhone} />
      <Stack.Screen name='OnboardingSuccess' component={OnboardingSuccess} />
      <Stack.Screen name='ProfileMenu' component={ProfileMenu} />
      <Stack.Screen name='ProfilePersonalInfo' component={ProfilePersonalInfo} />
      <Stack.Screen name='ProfileWorkingInfo' component={ProfileWorkingInfo} />
      <Stack.Screen name='ProfilePreferences' component={ProfilePreferences} />
      <Stack.Screen name='ProfileContactSupport' component={ProfileContactSupport} />
      <Stack.Screen name='ProfileResetPassword' component={ProfileResetPassword} />
      <Stack.Screen name='ProfileReferral' component={ProfileReferral} />
      <Stack.Screen name='ProfileDeleteAccount' component={ProfileDeleteAccount} />
      <Stack.Screen name='CommentEditor' component={CommentEditorScreen} />
    </Stack.Navigator>
  );
}
