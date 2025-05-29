import { Worker } from '@/types/worker';

export type OnboardingStep =
  | 'code'
  | 'confirm'
  | 'speciality'
  | 'name'
  | 'phone'
  | 'success';

export function getPendingOnboardingStep(worker: any): OnboardingStep | null {
  if (!worker?.worker_type_id && !worker?.worker?.worker_type_id) return 'code';
  if (!worker?.workers_specialities?.length && !worker?.specialityId) return 'speciality';
  if (!worker?.name && !worker?.worker?.name) return 'name';
  if (!worker?.mobile_phone && !worker?.worker?.mobile_phone) return 'phone';
  if (!worker?.onboarding_completed && !worker?.worker?.onboarding_completed) return 'success';

  return null; // onboarding completo → Calendar
}
