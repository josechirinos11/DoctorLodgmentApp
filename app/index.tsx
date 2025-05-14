import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../src/constants/Colors';

export default function Index() {
  const router = useRouter();
  
  // Redirigir a la página de login usando useEffect
  useEffect(() => {
    const redirect = async () => {
      // @ts-ignore - Ignorando error de tipo en router.replace
      router.replace('login');
    };
    
    redirect();
  }, []);
  
  // Mientras se redirige, mostrar un loader
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
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
});
