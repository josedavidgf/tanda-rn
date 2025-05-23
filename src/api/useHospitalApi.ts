// src/api/useHospitalApi.js
import { useState } from 'react';
import { getHospitals } from '../services/hospitalService';

export function useHospitalApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHospitals(token);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getHospitals: apiCall, loading, error };
}
