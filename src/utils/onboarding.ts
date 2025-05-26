
// utils/onboarding.ts

export function getPendingOnboardingStep(worker: any): string | null {
  if (!worker?.worker_type_id) return 'OnboardingCode';

  if (!worker?.workers_specialities || worker.workers_specialities.length === 0) {
    return 'OnboardingSpeciality';
  }

  if (!worker?.name || !worker?.surname) return 'OnboardingName';

  if (!worker?.mobile_phone || !worker?.mobile_country_code) {
    return 'OnboardingPhone';
  }

  if (!worker?.onboarding_completed) return 'OnboardingCode';

  return null;
}
