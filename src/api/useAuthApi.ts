// src/api/useAuthApi.js
import { useState } from 'react';
import {
  loginUser,
  registerUser,
  getUserProfile,
} from '../services/authService';

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token); // Guarda el token tras login
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(email, password);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getUserProfile();
      return profile;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Limpia el token en logout
  };

  return {
    login,
    register,
    fetchProfile,
    logout,
    loading,
    error,
  };
}
