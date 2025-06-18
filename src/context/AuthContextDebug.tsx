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
