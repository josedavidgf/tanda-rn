// src/services/userService.js
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Verificar si existe un worker
export const checkIfWorkerExists = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me`, authHeaders(token));
    return !!response.data.data;
  } catch (error) {
    console.error('❌ Error en checkIfWorkerExists:', error.message);
    throw new Error('Error al comprobar existencia del trabajador');
  }
};

// Verificar si el worker tiene hospital y especialidad
export const checkIfWorkerHasHospitalAndSpeciality = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me/completion`, authHeaders(token));
    const { hasHospital, hasSpeciality } = response.data.data;
    return hasHospital && hasSpeciality;
  } catch (error) {
    console.error('❌ Error en checkIfWorkerHasHospitalAndSpeciality:', error.message);
    throw new Error('Error al comprobar hospital y especialidad');
  }
};

// Obtener perfil completo del worker
export const getFullWorkerProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me/full`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getFullWorkerProfile:', error.message);
    throw new Error('Error al cargar perfil completo');
  }
};

// Actualizar info de worker
export const updateWorkerInfo = async (data, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/workers/me`, data, authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('❌ Error en updateWorkerInfo:', error.message);
    throw new Error('Error al actualizar perfil');
  }
};

// Actualizar hospital del worker
export const updateWorkerHospital = async (data, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/workers/me/hospital`, data, authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('❌ Error en updateWorkerHospital:', error.message);
    throw new Error('Error al actualizar hospital');
  }
};

// Actualizar especialidad del worker
export const updateWorkerSpeciality = async (data, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/workers/me/speciality`, data, authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('❌ Error en updateWorkerSpeciality:', error.message);
    throw new Error('Error al actualizar especialidad');
  }
};

// Obtener estadísticas del worker
export const getWorkerStats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me/stats`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getWorkerStats:', error.message);
    throw new Error('Error al cargar estadísticas');
  }
};

// Obtener preferencias del usuario
export const getUserPreferences = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/preferences`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getUserPreferences:', error.message);
    throw new Error('Error al cargar preferencias');
  }
};

// Actualizar preferencias del usuario
export const updateUserPreferences = async (payload, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/preferences`, payload, authHeaders(token));
    return response.data;
  } catch (error) {
    console.error('❌ Error en updateUserPreferences:', error.message);
    throw new Error('Error al actualizar preferencias');
  }
};
