import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { getPendingOnboardingStep, OnboardingStep } from '@/utils/getPendingOnboardingStep';

const stepToScreen: Record<OnboardingStep, string> = {
  code: 'OnboardingCode',
  confirm: 'OnboardingConfirm',
  speciality: 'OnboardingSpeciality',
  name: 'OnboardingName',
  phone: 'OnboardingPhone',
  success: 'OnboardingSuccess',
};

console.log('[GUARD] useOnboardingGuard initialized');

export const useOnboardingGuard = (expectedStep: OnboardingStep): void => {
  console.log('[GUARD] useOnboardingGuard called with expectedStep:', expectedStep);
  const navigation = useNavigation();
  const route = useRoute();
  console.log('[GUARD] useOnboardingGuard route', route.name);
  const { isWorker } = useAuth();

  console.log('[GUARD] useOnboardingGuard', { isWorker });

  useEffect(() => {
    if (!isWorker) return;

    const currentStep = getPendingOnboardingStep(isWorker);

    // ✅ Permitir paso a OnboardingConfirm justo después de código validado
    if (route.name === 'OnboardingConfirm' && expectedStep === 'confirm' && currentStep === 'code') {
      return;
    }

    if (currentStep !== expectedStep && currentStep !== null) {
      const fallbackRoute = stepToScreen[currentStep];
      navigation.reset({
        index: 0,
        routes: [{ name: fallbackRoute as never }],
      });
    }
  }, [isWorker, route.name]);

};
