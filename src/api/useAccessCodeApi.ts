// src/api/useAccessCodeApi.js
import { useState } from 'react';
import { validateAccessCode } from '../services/accessCodeService';

export function useAccessCodeApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const data = await validateAccessCode(code);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validateAccessCode: apiCall, loading, error };
}
