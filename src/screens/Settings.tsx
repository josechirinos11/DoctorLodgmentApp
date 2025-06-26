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
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);  const [biometricAuth, setBiometricAuth] = useState(false);

  const settingsGroups = [
    {
      title: 'Preferencias',
      items: [
        {
          id: 'notifications',
          title: 'Notificaciones',
          subtitle: 'Recibir alertas y mensajes',
          icon: 'notifications-outline',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
          color: '#FFB74D'
        },
        {
          id: 'location',
          title: 'Seguimiento de Ubicación',
          subtitle: 'Permitir acceso a tu ubicación',
          icon: 'location-outline',
          type: 'switch',
          value: locationTracking,
          onToggle: setLocationTracking,
          color: '#64B5F6'
        },
        {
          id: 'dark-mode',
          title: 'Modo Oscuro',
          subtitle: 'Tema de la aplicación',
          icon: 'moon-outline',
          type: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
          color: '#9575CD'
        },
        {
          id: 'language',
          title: 'Idioma',
          subtitle: 'Español',
          icon: 'language-outline',
          type: 'navigate',
          color: '#81C784',
          onPress: () => Alert.alert('Idioma', 'Funcionalidad en desarrollo')
        }
      ]
    },
    {
      title: 'Seguridad',
      items: [
        {
          id: 'biometric',
          title: 'Autenticación Biométrica',
          subtitle: 'Usar huella o Face ID',
          icon: 'finger-print-outline',
          type: 'switch',
          value: biometricAuth,
          onToggle: setBiometricAuth,
          color: '#F06292'
        },        {
          id: 'password',
          title: 'Cambiar Contraseña',
          subtitle: 'Actualizar tu contraseña',
          icon: 'key-outline',
          type: 'navigate',
          color: '#FF8A65',
          onPress: () => router.push('/change-password')
        },
        {
          id: 'two-factor',
          title: 'Autenticación de Dos Factores',
          subtitle: 'Seguridad adicional',
          icon: 'shield-checkmark-outline',
          type: 'navigate',
          color: '#A5D6A7',
          onPress: () => Alert.alert('2FA', 'Funcionalidad en desarrollo')
        }
      ]
    },
    {
      title: 'Datos y Almacenamiento',
      items: [
        {
          id: 'auto-backup',
          title: 'Respaldo Automático',
          subtitle: 'Guardar datos en la nube',
          icon: 'cloud-upload-outline',
          type: 'switch',
          value: autoBackup,
          onToggle: setAutoBackup,
          color: '#81D4FA'
        },
        {
          id: 'storage',
          title: 'Gestión de Almacenamiento',
          subtitle: 'Ver uso de espacio',
          icon: 'folder-outline',
          type: 'navigate',
          color: '#FFCC02',
          onPress: () => Alert.alert('Almacenamiento', 'Funcionalidad en desarrollo')
        },
        {
          id: 'export',
          title: 'Exportar Datos',
          subtitle: 'Descargar tu información',
          icon: 'download-outline',
          type: 'navigate',
          color: '#CE93D8',
          onPress: () => Alert.alert('Exportar', 'Funcionalidad en desarrollo')
        }
      ]
    },
    {
      title: 'Soporte',
      items: [
        {
          id: 'help',
          title: 'Centro de Ayuda',
          subtitle: 'Preguntas frecuentes',
          icon: 'help-circle-outline',
          type: 'navigate',
          color: '#90CAF9',
          onPress: () => Alert.alert('Ayuda', 'Funcionalidad en desarrollo')
        },
        {
          id: 'contact',
          title: 'Contactar Soporte',
          subtitle: 'Enviar mensaje al equipo',
          icon: 'mail-outline',
          type: 'navigate',
          color: '#80CBC4',
          onPress: () => Alert.alert('Contacto', 'Funcionalidad en desarrollo')
        },
        {
          id: 'about',
          title: 'Acerca de',
          subtitle: 'Versión 1.0.0',
          icon: 'information-circle-outline',
          type: 'navigate',
          color: '#BCAAA4',
          onPress: () => Alert.alert('Acerca de', 'Doctor Lodgment App v1.0.0\n\nDesarrollado para conectar profesionales de la salud.')
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={item.type === 'switch' ? 1 : 0.7}
      >
        <View style={[styles.settingIcon, { backgroundColor: Colors.primary }]}>
          <Ionicons name={item.icon} size={24} color={Colors.neumorphicBase} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.neumorphicDark, true: Colors.primary }}
            thumbColor={item.value ? Colors.neumorphicLight : Colors.neumorphicDark}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuraciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            Doctor Lodgment App
          </Text>
          <Text style={styles.appVersion}>
            Versión 1.0.0 • Build 001
          </Text>
        </View>
      </ScrollView>
       <View style={styles.bottomOverlay} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   bottomOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: Platform.OS === "android" ? 45 : 0, // Franja más delgada para cubrir zona de navegación
      backgroundColor: "#212121", // Negro para coincidir con la barra de navegación
    },
  container: {
    flex: 1,
    backgroundColor: Colors.neumorphicBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neumorphicCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neumorphicText,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  settingGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neumorphicText,
    paddingHorizontal: 16,    marginBottom: 12,
  },
  groupContainer: {
    backgroundColor: Colors.neumorphicCard,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neumorphicDark,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neumorphicText,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.neumorphicTextSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.neumorphicCard,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.neumorphicTextSecondary,
  },
});

export default Settings;
