import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Colors from '../src/constants/Colors';
import { useAuth } from '../src/context/AuthContext'; // Volviendo al original

export default function Index() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  
  console.log('Index component rendered');
  
  useEffect(() => {
    console.log('Index: isLoading =', isLoading, ', isAuthenticated =', isAuthenticated);
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Index: Redirigiendo a /home');
        router.replace('/home');
      } else {
        console.log('Index: Redirigiendo a /login');
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated]);
  
  // Mientras se carga el contexto de autenticación, mostrar un loader
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
});
