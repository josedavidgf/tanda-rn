// src/api/useUserApi.js
import { useState } from 'react';
import { 
  getFullWorkerProfile,
  updateWorkerInfo, 
  updateWorkerHospital,
  updateWorkerSpeciality, 
  getUserPreferences, 
  updateUserPreferences  
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
    getFullWorkerProfile: (token) => callApi(getFullWorkerProfile, token), 
    updateWorkerInfo: (data, token) => callApi(updateWorkerInfo, data, token),
    updateWorkerHospital: (data, token) => callApi(updateWorkerHospital, data, token),
    updateWorkerSpeciality: (data, token) => callApi(updateWorkerSpeciality, data, token),
    getUserPreferences: (token) => callApi(getUserPreferences, token),
    updateUserPreferences: (data, token) => callApi(updateUserPreferences, data, token),

    loading,
    error,
  };
}
