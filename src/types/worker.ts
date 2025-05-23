export type Worker = {
  worker_id: string;
  worker_type_id?: string;
  name?: string;
  surname?: string;
  mobile_phone?: string;
  mobile_country_code?: string;
  onboarding_completed?: boolean;
  workers_specialities?: { speciality_id: string }[];
  workers_hospitals?: { hospital_id: string }[];
};
