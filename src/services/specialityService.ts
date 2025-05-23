// src/services/specialityService.js
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

// Obtener todas las especialidades
export const getSpecialities = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/specialities`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getSpecialities:', error.message);
    throw new Error('Error al cargar especialidades');
  }
};

// Asignar una especialidad a un worker
export const addSpecialityToWorker = async (workerId, specialityId, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers/specialities`, {
      workerId,
      specialityId,
      qualificationLevel: 'resident', // Ajustable si quieres
      experienceYears: 1,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error en addSpecialityToWorker:', error.message);
    throw new Error('Error al asignar especialidad');
  }
};

// Obtener especialidades por hospital
export async function getSpecialitiesByHospital(hospitalId, token) {
  try {
    const response = await axios.get(`${API_URL}/api/specialities/by-hospital/${hospitalId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getSpecialitiesByHospital:', error.message);
    throw new Error('Error al cargar especialidades del hospital');
  }
}
