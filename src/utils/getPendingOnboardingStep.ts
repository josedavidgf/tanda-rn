import { Worker } from '@/types/worker'; // ajusta la ruta según tu modelo

export function getPendingOnboardingStep(worker: Worker | null): string | null {
  if (!worker || !worker.worker_type_id) {
    return 'OnboardingCode';
  }

  if (!worker.workers_specialities || worker.workers_specialities.length === 0) {
    return 'OnboardingSpeciality';
  }

  if (!worker.name || !worker.surname) {
    return 'OnboardingName';
  }

  if (!worker.mobile_country_code || !worker.mobile_phone) {
    return 'OnboardingPhone';
  }

  if (!worker.onboarding_completed) {
    return 'OnboardingSuccess';
  }

  return null;
}
