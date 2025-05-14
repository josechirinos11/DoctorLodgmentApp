import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL base del API
const API_URL = 'http://10.0.2.2:3000'; // Para emulador Android, cambia a localhost o IP según necesidad

// Definir tipos
type User = {
  _id: string;
  email: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  city: string;
  country: string;
  idNumber: string;
  isActive: boolean;
  role: string;
  gallery: string[];
  profileImage: string;
  titleMedicineImage: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  updateProfileImage: (imageUri: string) => Promise<void>;
};

type RegisterData = {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
  phone?: string;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprobar el token al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          // Configurar axios con el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener perfil del usuario
          const response = await axios.get(`${API_URL}/auth/profile`);
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Si hay algún error, eliminar el token
        await AsyncStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      // Guardar el token
      await AsyncStorage.setItem('token', token);
      
      // Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      // Guardar el token
      await AsyncStorage.setItem('token', token);
      
      // Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil del usuario
  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (user) {
        const response = await axios.put(`${API_URL}/users/${user._id}`, userData);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar imagen de perfil
  const updateProfileImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      if (user) {
        const formData = new FormData();
        const filename = imageUri.split('/').pop();
        
        // Crear objeto de tipo archivo para el form-data
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename || 'profile.jpg',
        } as any);
        
        const response = await axios.post(
          `${API_URL}/users/${user._id}/profile-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        // Actualizar el usuario con la nueva imagen
        setUser(prev => prev ? { ...prev, profileImage: response.data.profileImage } : null);
      }
    } catch (error) {
      console.error('Error al actualizar imagen de perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    updateProfileImage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 