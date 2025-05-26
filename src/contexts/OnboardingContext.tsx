import React, { createContext, useContext, useState } from 'react';

type OnboardingContextType = {
  accessCode?: string;
  hospitalId?: string;
  specialityId?: string;
  workerTypeId?: string;
  hospitalName?: string;
  workerTypeName?: string;
  name?: string;
  surname?: string;
  mobilePhone?: string;
  prefix?: string;
  setOnboardingData: (data: Partial<OnboardingContextType>) => void;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Partial<OnboardingContextType>>({});

  const setOnboardingData = (newData: Partial<OnboardingContextType>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetOnboarding = () => {
    setData({});
  };

  return (
    <OnboardingContext.Provider
      value={{
        ...data,
        setOnboardingData,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};



export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  console.log('[OnboardingContext] useContext', context);
  if (!context) {
    console.error('[OnboardingContext] fuera de Provider');
    throw new Error('[OnboardingContext] debe usarse dentro de <OnboardingProvider>');
  }
  return context;
};
