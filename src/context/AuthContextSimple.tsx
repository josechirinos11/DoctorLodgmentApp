import React, { createContext, useContext, useEffect, useState } from 'react';

// Tipos muy simplificados
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor ultra simplificado para debug
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulación muy simple de inicialización
  useEffect(() => {
    console.log('AuthContextSimple: Iniciando...');
    
    // Timeout muy corto para simular carga
    const timer = setTimeout(() => {
      console.log('AuthContextSimple: Carga completada, isLoading = false');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Función de login simulada
  const login = async (email: string, password: string) => {
    console.log('AuthContextSimple: Intentando login...');
    setIsLoading(true);
    
    // Simular petición
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAuthenticated(true);
    setIsLoading(false);
    console.log('AuthContextSimple: Login exitoso');
  };

  // Función de logout
  const logout = async () => {
    console.log('AuthContextSimple: Logout');
    setIsAuthenticated(false);
  };

  const value = {
    isLoading,
    isAuthenticated,
    login,
    logout
  };

  console.log('AuthContextSimple: Renderizando con valores:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
    console.log('AuthProvider: Iniciando...');
    const loadUser = async () => {
      try {
        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar si hay token guardado
        const token = await AsyncStorage.getItem('token');
        console.log('AuthProvider: Token encontrado:', !!token);
        
        if (token) {
          // Aquí normalmente harías la petición al servidor
          // Por ahora simulamos un usuario
          setUser({
            _id: '1',
            email: 'usuario@test.com',
            name: 'Usuario',
            lastName: 'Test'
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('AuthProvider: Error:', error);
      } finally {
        console.log('AuthProvider: Carga completada');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login simplificada
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Login attempt:', email);
      
      // Simular petición de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular token
      await AsyncStorage.setItem('token', 'fake-token');
      
      setUser({
        _id: '1',
        email: email,
        name: 'Usuario',
        lastName: 'Test'
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
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
