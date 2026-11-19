import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  alInvalidarSesion,
  almacenToken,
  anularEnServidor,
  api,
  describirError,
  esSesionInvalida,
} from '../services/sesion';

// Sesión de la app. El token se guarda cifrado (ver services/sesion.ts) y el usuario solo
// en memoria: se pide siempre a /auth/profile. El token no lleva datos personales.
//
// Regla de los logs: nunca el objeto de error de axios (lleva la contraseña del login y
// el token en las cabeceras), nunca el token, nunca el email. Solo `describirError`.

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Olvida la sesión en este dispositivo (el token ya se borró o se borra aquí).
  const olvidarSesion = useCallback(async () => {
    await almacenToken.borrar().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Un 401 de sesión inválida en cualquier petición (token caducado, sesión cerrada en
  // otro sitio o contraseña restablecida) devuelve al login.
  useEffect(() => {
    alInvalidarSesion(() => {
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    });
  }, []);

  // Al arrancar: si hay token guardado, se comprueba con el servidor.
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = await almacenToken.leer();
        if (!token) return;
        const { data } = await api.get<User>('/auth/profile');
        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        // Sesión inválida → se borra. Sin conexión → se conserva para el próximo arranque,
        // pero no se entra con un token que no se ha podido comprobar.
        if (esSesionInvalida(error)) await olvidarSesion();
        console.log('Sesión: no se pudo restaurar:', describirError(error));
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, [olvidarSesion]);

  const entrarCon = async (token: string, perfil?: User) => {
    await almacenToken.guardar(token);
    const datos = perfil ?? (await api.get<User>('/auth/profile')).data;
    setUser(datos);
    setIsAuthenticated(true);
    router.replace('/home');
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
      await entrarCon(data.token);
    } catch (error) {
      console.log('Login fallido:', describirError(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const { data } = await api.post<{ token: string; user: User }>('/auth/register', userData);
      await entrarCon(data.token, data.user);
    } catch (error) {
      console.log('Registro fallido:', describirError(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión: primero se borra todo en el dispositivo (aunque no haya conexión, la
  // sesión se acaba aquí) y luego se anula el token en el servidor por si alguien lo
  // hubiera copiado.
  const logout = async () => {
    setIsLoading(true);
    const token = await almacenToken.leer().catch(() => null);
    await olvidarSesion();
    setIsLoading(false);
    if (token) {
      anularEnServidor(token).catch((error) => console.log('Logout en servidor:', describirError(error)));
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (user) {
        const { data } = await api.put<User>(`/users/${user._id}`, userData);
        setUser(data);
      }
    } catch (error) {
      console.log('Error al actualizar perfil:', describirError(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      if (user) {
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        const { data } = await api.post(`/users/${user._id}/profile-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setUser((prev) => (prev ? { ...prev, profileImage: data.profileImage } : null));
      }
    } catch (error) {
      console.log('Error al actualizar imagen de perfil:', describirError(error));
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
    updateProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
