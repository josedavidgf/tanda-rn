import React, { createContext, useContext, useState } from 'react';

type OnboardingContextType = {
  accessCode?: string;
  hospitalId?: string;
  workerTypeId?: string;
  hospitalName?: string;
  workerTypeName?: string;
  setStepData: (data: Partial<OnboardingContextType>) => void;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Partial<OnboardingContextType>>({});

  const setStepData = (newData: Partial<OnboardingContextType>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetOnboarding = () => {
    setData({});
  };

  return (
    <OnboardingContext.Provider
      value={{
        ...data,
        setStepData,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext debe usarse dentro de OnboardingProvider');
  }
  return context;
};
