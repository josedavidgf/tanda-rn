import { useState } from 'react';
import {
  getWorkerTypes,
  createWorker,
  getMyWorkerProfile,
  createWorkerHospital,
  createWorkerSpeciality,
  completeOnboarding,
} from '@/services/workerService';

export function useWorkerApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(fn: (...args: any[]) => Promise<T>, ...params: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn(...params);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getWorkerTypes: (token: string) => apiCall(getWorkerTypes, token),
    createWorker: (data: any, token: string) => apiCall(createWorker, data, token),
    getMyWorkerProfile: (token: string) => apiCall(getMyWorkerProfile, token),
    createWorkerHospital: (workerId: string, hospitalId: string, token: string) =>
      apiCall(createWorkerHospital, workerId, hospitalId, token),
    createWorkerSpeciality: (
      workerId: string,
      specialityId: string,
      qualificationLevel: string,
      token: string
    ) => apiCall(createWorkerSpeciality, workerId, specialityId, qualificationLevel, token),
    completeOnboarding: (token: string) => apiCall(completeOnboarding, token),
    loading,
    error,
  };
}