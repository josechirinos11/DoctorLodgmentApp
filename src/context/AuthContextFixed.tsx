import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

// URL base del API - configuración según tu backend
const API_URL = 'http://localhost:3001'; // Puerto correcto del servidor
const REQUEST_TIMEOUT = 5000;

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
      console.log('AuthContext: Iniciando carga de usuario...');
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('AuthContext: Token encontrado:', token ? 'Sí' : 'No');
        
        if (token) {
          // Configurar axios con el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener perfil del usuario con timeout
          const response = await Promise.race([
            axios.get(`${API_URL}/auth/profile`),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), REQUEST_TIMEOUT)
            )
          ]) as any;
          setUser(response.data);
          setIsAuthenticated(true);
          console.log('AuthContext: Usuario cargado exitosamente');
        }
      } catch (error: any) {
        console.log('AuthContext: Error cargando usuario (posiblemente sin backend):', error?.message || 'Error desconocido');
        // Si hay algún error, eliminar el token
        await AsyncStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        console.log('AuthContext: Finalizando carga, isLoading = false');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`Intentando login en: ${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      // Guardar el token
      await AsyncStorage.setItem('token', token);
      
      // Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      console.log('Login exitoso');
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
      console.log(`Intentando registro en: ${API_URL}/auth/register`);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      // Guardar el token
      await AsyncStorage.setItem('token', token);
      
      // Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      console.log('Registro exitoso');
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

  // Función para actualizar el perfil del usuario
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

  // Función para actualizar la imagen de perfil
  const updateProfileImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      if (user) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
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

        setUser(prev => prev ? { ...prev, profileImage: response.data.profileImage } : null);
      }
    } catch (error) {
      console.error('Error al actualizar imagen de perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
