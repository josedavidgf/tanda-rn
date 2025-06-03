// src/api/useUserApi.js
import { useState } from 'react';
import { 
  getFullWorkerProfile,
  updateWorkerInfo, 
  updateWorkerHospital,
  updateWorkerSpeciality, 
  getUserPreferences, 
  updateUserPreferences,
  updateWorkerType,
} from '../services/userService';

export function useUserApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiFunction, ...params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...params);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getFullWorkerProfile: (token: string) => callApi(getFullWorkerProfile, token), 
    updateWorkerInfo: (data: any, token: string) => callApi(updateWorkerInfo, data, token),
    updateWorkerHospital: (data: any, token: string) => callApi(updateWorkerHospital, data, token),
    updateWorkerSpeciality: (data: any, token: string) => callApi(updateWorkerSpeciality, data, token),
    getUserPreferences: (token: string) => callApi(getUserPreferences, token),
    updateUserPreferences: (data: any, token: string) => callApi(updateUserPreferences, data, token),
    updateWorkerType: (data: any, token: string) => callApi(updateWorkerType, data, token),
    loading,
    error,
  };
}
