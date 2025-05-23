import { useState } from 'react';
import { getFeatureFlags } from '../services/featureFlagService';

export function useFeatureFlagApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFlags = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const flags = await getFeatureFlags(token);
      return flags;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getFeatureFlags: getFlags,
    loading,
    error,
  };
}
