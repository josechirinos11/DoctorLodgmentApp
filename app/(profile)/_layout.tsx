import { Stack } from 'expo-router';
import React from 'react';
import Colors from '../../src/constants/Colors';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        contentStyle: { backgroundColor: Colors.secondary },
      }}
    >
      <Stack.Screen
        name="my-photos"
        options={{
          title: 'Mis Fotos',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
