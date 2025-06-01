import { useState } from 'react';
import { validateAccessCode, getAccessCode } from '../services/accessCodeService';

export function useAccessCodeApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validate = async (code: string) => {
    return handle(() => validateAccessCode(code));
  };

  const fetchAccessCode = async (hospitalId: string, workerTypeId: string) => {
    return handle(() => getAccessCode(hospitalId, workerTypeId));
  };

  return {
    validateAccessCode: validate,
    getAccessCode: fetchAccessCode,
    loading,
    error,
  };
}
