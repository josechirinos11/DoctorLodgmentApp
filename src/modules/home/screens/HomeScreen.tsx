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

const HomeScreen = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const quickActions = [
    {
      id: 'events',
      title: 'Congresos',
      subtitle: 'Ver eventos médicos',
      icon: 'calendar',
      color: Colors.primary,
      action: () => router.push('/(tabs)/events')
    },
    {
      id: 'chat',
      title: 'Chat',
      subtitle: 'Mensajes médicos',
      icon: 'chatbubbles',
      color: '#00D4AA',
      action: () => router.push('/(tabs)/chat')
    },
    {
      id: 'contacts',
      title: 'Contactos',
      subtitle: 'Agenda médica',
      icon: 'people',
      color: '#FF6B6B',
      action: () => router.push('/(tabs)/contacts')
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      subtitle: 'Información personal',
      icon: 'person',
      color: '#4ECDC4',
      action: () => router.push('/(tabs)/profile')
    }
  ];

  const recentActivities = [
    { id: '1', title: 'Congreso de Cardiología', time: '2 horas', type: 'event' },
    { id: '2', title: 'Mensaje de Dr. García', time: '5 min', type: 'message' },
    { id: '3', title: 'Nuevo contacto agregado', time: '1 día', type: 'contact' },
  ];

  const renderQuickAction = (action: any) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.action}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
        <Ionicons name={action.icon} size={24} color={action.color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderActivity = (activity: any) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons 
          name={activity.type === 'event' ? 'calendar' : activity.type === 'message' ? 'chatbubble' : 'person-add'} 
          size={16} 
          color={Colors.primary} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityTime}>hace {activity.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, Doctor!</Text>
          <Text style={styles.subtitle}>Bienvenido a DoctorLodgment</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => Alert.alert('Notificaciones', 'Tienes 3 notificaciones nuevas')}
        >
          <Ionicons name="notifications" size={24} color={Colors.textLight} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map(renderActivity)}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todas las actividades</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Eventos este mes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Contactos activos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Mensajes no leídos</Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  greeting: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  activitiesContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
    gap: 4,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
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

export default HomeScreen;
