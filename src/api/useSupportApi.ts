// src/api/useSupportApi.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../app/hooks/useToast';
import { sendSupportContact as sendContactService } from '../services/supportService';

export function useSupportApi() {
  const { accessToken, isWorker } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendSupportContact = async (title, description) => {
    setLoading(true);
    setError(null);

    try {
      const workerId = isWorker?.worker_id;
      const data = await sendContactService(workerId, title, description, accessToken);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendSupportContact,
    loading,
    error,
  };
}
