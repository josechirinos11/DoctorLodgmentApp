import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const Privacy: React.FC = () => {
    const insets = useSafeAreaInsets();
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
        const setupNavigationBar = async () => {
            if (Platform.OS === 'android') {
                try {
                    await NavigationBar.setBackgroundColorAsync(Colors.neumorphicBase);
                    await NavigationBar.setBorderColorAsync(Colors.neumorphicBase);
                    await NavigationBar.setButtonStyleAsync('light');
                } catch (error) {
                    console.warn('Error setting navigation bar:', error);
                }
            }
        };
        setupNavigationBar();
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
            color: Colors.neonGreen
        },
        {
            key: 'showPhotos',
            title: 'Fotos Públicas',
            subtitle: 'Permitir que otros vean tus fotos',
            icon: 'camera-outline',
            color: Colors.neonGreenDark
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
          color: Colors.primary
        },
        {
          key: 'allowReviews',
          title: 'Permitir Reseñas',
          subtitle: 'Otros pueden escribir reseñas sobre ti',
          icon: 'star-outline',
          color: Colors.warning
        },
        {
          key: 'pushNotifications',
          title: 'Notificaciones Push',
          subtitle: 'Recibir notificaciones en tu dispositivo',
          icon: 'notifications-outline',
          color: Colors.info
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
          color: Colors.error
        },
        {
          key: 'dataCollection',
          title: 'Recopilación de Datos',
          subtitle: 'Permitir análisis de uso',
          icon: 'analytics-outline',
          color: Colors.neonGreen
        },
        {
          key: 'marketingEmails',
          title: 'Emails de Marketing',
          subtitle: 'Recibir ofertas y promociones',
          icon: 'mail-outline',
          color: Colors.accent
        }
      ]
    }
  ];
    const SettingItem = ({ item }: { item: { key: string; title: string; subtitle: string; icon: string; color: string } }) => (
        <View style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={20} color={Colors.neumorphicLight} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>
            <Switch
                value={settings[item.key as keyof typeof settings]}
                onValueChange={() => handleToggle(item.key)}
                trackColor={{ false: Colors.neumorphicDark, true: item.color }}
                thumbColor={Colors.neumorphicLight}
                ios_backgroundColor={Colors.neumorphicDark}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" backgroundColor={Colors.neumorphicBase} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 10 : 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
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
              <Ionicons name="download-outline" size={20} color={Colors.neumorphicLight} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Exportar Mis Datos</Text>
              <Text style={styles.actionSubtitle}>Descargar una copia de tus datos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.neumorphicTextSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.error }]}>
              <Ionicons name="trash-outline" size={20} color={Colors.neumorphicLight} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: Colors.error }]}>Eliminar Cuenta</Text>
              <Text style={styles.actionSubtitle}>Eliminar permanentemente tu cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.neumorphicTextSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Overlay para Android */}
      {Platform.OS === 'android' && (
        <View style={styles.bottomOverlay} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neumorphicBase,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: Colors.neumorphicBase,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.neumorphicCard,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -3,
            height: -3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 6,
    },
    headerTitle: {
        color: Colors.neumorphicText,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    description: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 16,
        lineHeight: 24,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '400',
    },
    group: {
        marginTop: 24,
    },
    groupTitle: {
        color: Colors.neumorphicText,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neumorphicCard,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -4,
            height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        color: Colors.neumorphicText,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    settingSubtitle: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 14,
        marginTop: 4,
        lineHeight: 18,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neumorphicCard,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -4,
            height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        color: Colors.neumorphicText,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    actionSubtitle: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 14,
        marginTop: 4,
        lineHeight: 18,
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

export default Privacy;
