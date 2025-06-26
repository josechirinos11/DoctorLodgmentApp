import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../../constants/Colors';

const ProfileScreen = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const profileOptions = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      subtitle: 'Actualiza tu información personal',
      icon: 'person-outline',
      action: () => router.push('/edit-profile')
    },
    {
      id: 'my-photos',
      title: 'Mis Fotos',
      subtitle: 'Gestiona tus fotos y documentos',
      icon: 'camera-outline',
      action: () => router.push('/my-photos')
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Ajustes y preferencias',
      icon: 'settings-outline',
      action: () => router.push('/settings')
    },
    {
      id: 'change-password',
      title: 'Cambiar Contraseña',
      subtitle: 'Actualiza tu contraseña',
      icon: 'lock-closed-outline',
      action: () => router.push('/change-password')
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      subtitle: 'Configuración de privacidad',
      icon: 'shield-outline',
      action: () => router.push('/privacy')
    }
  ];

  const renderOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.action}
      activeOpacity={0.8}
    >
      <View style={styles.optionIcon}>
        <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica de logout
            Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={Colors.textSecondary} />
          </View>
          <Text style={styles.userName}>Dr. Juan Pérez</Text>
          <Text style={styles.userEmail}>juan.perez@doctorapp.com</Text>
          <Text style={styles.userSpecialty}>Cardiología</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {profileOptions.map(renderOption)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom overlay for Android navigation bar */}
      {Platform.OS === 'android' && (
        <View style={styles.bottomOverlay} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  userSpecialty: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  optionsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    gap: 8,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: Colors.secondary,
  },
});

export default ProfileScreen;
