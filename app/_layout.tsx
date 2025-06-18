import { Stack } from 'expo-router';
import React from 'react';
import Colors from '../src/constants/Colors';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  console.log('RootLayout renderizado');

  return (
    <AuthProvider>
     
      <Stack screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.secondary }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="user-profile" />
        <Stack.Screen name="settings" />        <Stack.Screen name="edit-profile" />        <Stack.Screen name="subscription" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="my-photos" />
        <Stack.Screen name="privacy" />
      </Stack>
    </AuthProvider>
  );
}
