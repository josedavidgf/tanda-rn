import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getPendingOnboardingStep } from '@/utils/getPendingOnboardingStep';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  currentStep: string;
};

export function useOnboardingGuard({ currentStep }: Props) {
  const { isWorker } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const expectedStep = getPendingOnboardingStep(isWorker);
    if (expectedStep && expectedStep !== currentStep) {
      navigation.reset({
        index: 0,
        routes: [{ name: expectedStep as never }],
      });
    }
  }, [isWorker, currentStep, navigation]);
}
