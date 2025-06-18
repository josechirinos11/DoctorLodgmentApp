import { API_BASE_URL, API_TIMEOUT } from '@env';

// Configuración central de la API
export const CONFIG = {
  API: {
    BASE_URL: API_BASE_URL || 'http://192.168.1.133:3001',
    TIMEOUT: parseInt(API_TIMEOUT) || 5000,    ENDPOINTS: {
      // Auth endpoints (según tu backend)
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      REFRESH: '/auth/refresh',
      
      // User endpoints
      UPDATE_PROFILE: '/api/users/profile',
      UPLOAD_IMAGE: '/api/users/upload-image',
      
      // Other endpoints
      LODGMENTS: '/api/lodgments',
      BOOKINGS: '/api/bookings',
    }
  },
  
  // Configuraciones de la app
  APP: {
    NAME: 'DoctorLodgmentApp',
    VERSION: '1.0.0',
  }
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${CONFIG.API.BASE_URL}${endpoint}`;
};

// Helper para obtener headers comunes
export const getApiHeaders = (token?: string) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};
