import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.92:4000';

const handleError = (error: any, defaultMessage: string = 'Error en la operación') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getWorkerTypes = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/workerTypes`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al obtener tipos de trabajador'));
  }
};

export const createWorker = async (data: any, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers`, data, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al crear trabajador'));
  }
};

export const getMyWorkerProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar perfil de trabajador'));
  }
};

export const createWorkerHospital = async (workerId: string, hospitalId: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers/hospitals`, {
      workerId,
      hospitalId,
    }, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al vincular trabajador con hospital'));
  }
};

export const createWorkerSpeciality = async (
  workerId: string,
  specialityId: string,
  qualificationLevel: string,
  token: string
) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers/specialities`, {
      workerId,
      specialityId,
      qualificationLevel,
      experienceYears: 1,
    }, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al vincular trabajador con especialidad'));
  }
};

export const completeOnboarding = async (token: string) => {
  try {
    const response = await axios.patch(`${API_URL}/api/workers/complete-onboarding`, {}, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al completar onboarding'));
  }
};