import React, { useEffect } from 'react';
import { useSegments, useRouter, Slot } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Rutas públicas (accesibles sin autenticación)
const publicRoutes = ['/', '/signup', '/login', '/forgot-password'];

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Determinar si la ruta actual es pública
  const isPublicRoute = () => {
    const inPublicGroup = segments[0] === '(public)';
    const path = `/${segments.join('/')}`;
    return publicRoutes.some(route => path.startsWith(route)) || inPublicGroup;
  };

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (isLoading) return;

    const isPublic = isPublicRoute();

    if (!isAuthenticated && !isPublic) {
      // Redirigir a login si el usuario no está autenticado y la ruta no es pública
      router.replace('/login');
    } else if (isAuthenticated && isPublic) {
      // Redirigir a home si el usuario está autenticado y está en una ruta pública
      router.replace('/home');
    }
  }, [isAuthenticated, segments, isLoading]);

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e78b7" />
      </View>
    );
  }

  // Renderizar los hijos (Slot)
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AuthLayout; 