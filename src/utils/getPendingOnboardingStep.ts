import { Worker } from '@/types/worker';

export type OnboardingStep =
  | 'code'
  | 'confirm'
  | 'speciality'
  | 'name'
  | 'phone'
  | 'success';

export function getPendingOnboardingStep(worker: any): OnboardingStep | null {
  console.log('[UTIL] getPendingOnboardingStep', worker);
  console.log('[UTIL] getPendingOnboardingStep worker', worker?.worker_id || worker?.worker?.worker_id);
  console.log('[UTIL] getPendingOnboardingStep workerTypeId', worker?.worker_type_id || worker?.worker?.worker_type_id);
  console.log('[UTIL] getPendingOnboardingStep workersHospitals', worker?.workers_hospitals || worker?.hospitalId);
  console.log('[UTIL] getPendingOnboardingStep workersSpecialities', worker?.workers_specialities || worker?.specialityId);
  console.log('[UTIL] getPendingOnboardingStep name', worker?.name || worker?.worker?.name);
  console.log('[UTIL] getPendingOnboardingStep surname', worker?.surname || worker?.worker?.surname);
  console.log('[UTIL] getPendingOnboardingStep mobilePhone', worker?.mobile_phone || worker?.worker?.mobile_phone);
  console.log('[UTIL] getPendingOnboardingStep mobileCountryCode', worker?.mobile_country_code || worker?.worker?.mobile_country_code);
  console.log('[UTIL] getPendingOnboardingStep onboardingCompleted', worker?.onboarding_completed || worker?.worker?.onboarding_completed);
  if (!worker?.worker_type_id && !worker?.worker?.worker_type_id) return 'code';
  if (!worker?.workers_specialities?.length && !worker?.specialityId) return 'speciality';
  if (!worker?.name && !worker?.worker?.name) return 'name';
  if (!worker?.mobile_phone && !worker?.worker?.mobile_phone) return 'phone';
  if (!worker?.onboarding_completed && !worker?.worker?.onboarding_completed) return 'success';

  return null; // onboarding completo → Calendar
}
