import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
import Colors from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    messages: 42,
    photos: 18,
    posts: 7  });

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const menuItems = [    {
      id: 'personal-info',
      title: 'Datos Personales',
      subtitle: 'Edita tu información personal',
      icon: 'person-outline',
      color: Colors.primary,
      onPress: () => router.push('/edit-profile')
    },    {
      id: 'subscription',
      title: 'Suscripción',
      subtitle: 'Gestiona tu plan y facturación',
      icon: 'card-outline',
      color: '#FFB74D',
      onPress: () => router.push('/subscription')
    },    {
      id: 'photos',
      title: 'Mis Fotos',
      subtitle: `${userStats.photos} fotos subidas`,
      icon: 'camera-outline',
      color: '#64B5F6',
      onPress: () => router.push('/my-photos')
    },
    {
      id: 'messages',
      title: 'Mensajes',
      subtitle: `${userStats.messages} conversaciones`,
      icon: 'chatbubbles-outline',
      color: '#81C784',
      onPress: () => Alert.alert('Mensajes', 'Funcionalidad en desarrollo')
    },
    {
      id: 'content',
      title: 'Mi Contenido',
      subtitle: `${userStats.posts} publicaciones`,
      icon: 'library-outline',
      color: '#F06292',
      onPress: () => Alert.alert('Contenido', 'Funcionalidad en desarrollo')
    },    {
      id: 'privacy',
      title: 'Privacidad',
      subtitle: 'Configuración de privacidad',
      icon: 'shield-checkmark-outline',
      color: '#9575CD',
      onPress: () => router.push('/privacy')
    }
  ];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={Colors.neumorphicBase} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.email || 'Usuario'}</Text>
          <Text style={styles.userRole}>Miembro Premium</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.messages}</Text>
              <Text style={styles.statLabel}>Mensajes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.photos}</Text>
              <Text style={styles.statLabel}>Fotos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: Colors.primary }]}>
                <Ionicons name={item.icon as any} size={24} color={Colors.neumorphicBase} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        {/* Espaciado para el bottomOverlay */}
        <View style={{ height: Platform.OS === "android" ? 60 : 20 }} />
      </ScrollView>
      
      {/* Bottom Overlay para cubrir la barra de navegación de Android */}
      <View style={styles.bottomOverlay} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neumorphicBase,
  },
  header: {
    flexDirection: 'row',    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neumorphicBase,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neumorphicText,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.neumorphicCard,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neumorphicBase,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neumorphicText,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 24,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neumorphicBase,    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neumorphicTextSecondary,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neumorphicText,
    marginBottom: 2,
  },  menuSubtitle: {
    fontSize: 14,
    color: Colors.neumorphicTextSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
   bottomOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: Platform.OS === "android" ? 45 : 0, // Franja más delgada para cubrir zona de navegación
      backgroundColor: "#212121", // Negro para coincidir con la barra de navegación
    },
});

export default UserProfile;
