import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
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

const Privacy = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    allowMessages: true,
    shareLocation: false,
    showPhotos: true,
    allowReviews: true,
    dataCollection: false,
    marketingEmails: false,
    pushNotifications: true,
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar Cuenta',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '¿Estás seguro?',
              'Escribe "ELIMINAR" para confirmar',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', style: 'destructive', onPress: () => Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada') }
              ]
            );
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      'Te enviaremos un archivo con todos tus datos por email',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => Alert.alert('Enviado', 'Revisa tu email en los próximos minutos') }
      ]
    );
  };

  const privacyGroups = [
    {
      title: 'Visibilidad del Perfil',
      items: [
        {
          key: 'profileVisibility',
          title: 'Perfil Público',
          subtitle: 'Permitir que otros vean tu perfil',
          icon: 'eye-outline',
          color: Colors.primary
        },
        {
          key: 'showOnlineStatus',
          title: 'Estado En Línea',
          subtitle: 'Mostrar cuando estás activo',
          icon: 'radio-outline',
          color: '#81C784'
        },
        {
          key: 'showPhotos',
          title: 'Fotos Públicas',
          subtitle: 'Permitir que otros vean tus fotos',
          icon: 'camera-outline',
          color: '#64B5F6'
        }
      ]
    },
    {
      title: 'Comunicación',
      items: [
        {
          key: 'allowMessages',
          title: 'Recibir Mensajes',
          subtitle: 'Permitir mensajes de otros usuarios',
          icon: 'chatbubbles-outline',
          color: '#F06292'
        },
        {
          key: 'allowReviews',
          title: 'Permitir Reseñas',
          subtitle: 'Otros pueden escribir reseñas sobre ti',
          icon: 'star-outline',
          color: '#FFB74D'
        },
        {
          key: 'pushNotifications',
          title: 'Notificaciones Push',
          subtitle: 'Recibir notificaciones en tu dispositivo',
          icon: 'notifications-outline',
          color: '#9575CD'
        }
      ]
    },
    {
      title: 'Ubicación y Datos',
      items: [
        {
          key: 'shareLocation',
          title: 'Compartir Ubicación',
          subtitle: 'Mostrar tu ubicación aproximada',
          icon: 'location-outline',
          color: '#FF8A65'
        },
        {
          key: 'dataCollection',
          title: 'Recopilación de Datos',
          subtitle: 'Permitir análisis de uso',
          icon: 'analytics-outline',
          color: '#4DB6AC'
        },
        {
          key: 'marketingEmails',
          title: 'Emails de Marketing',
          subtitle: 'Recibir ofertas y promociones',
          icon: 'mail-outline',
          color: '#A1887F'
        }
      ]
    }
  ];
  const SettingItem = ({ item }: any) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={20} color={Colors.textLight} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <Switch
        value={settings[item.key as keyof typeof settings]}
        onValueChange={() => handleToggle(item.key)}
        trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: item.color }}
        thumbColor={Colors.textLight}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Controla quién puede ver tu información y cómo se utilizan tus datos.
        </Text>

        {privacyGroups.map((group, index) => (
          <View key={index} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.items.map((item) => (
              <SettingItem key={item.key} item={item} />
            ))}
          </View>
        ))}

        {/* Data Management */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Gestión de Datos</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
              <Ionicons name="download-outline" size={20} color={Colors.textLight} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Exportar Mis Datos</Text>
              <Text style={styles.actionSubtitle}>Descargar una copia de tus datos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.error }]}>
              <Ionicons name="trash-outline" size={20} color={Colors.textLight} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: Colors.error }]}>Eliminar Cuenta</Text>
              <Text style={styles.actionSubtitle}>Eliminar permanentemente tu cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  group: {
    marginTop: 24,
  },
  groupTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  actionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
});

export default Privacy;
