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
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [billingInfo, setBillingInfo] = useState({
    nextBilling: '15 Jul 2025',
    amount: '$9.99',
    method: 'Visa ****1234'
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Gratis',
      features: [
        'Búsqueda básica de médicos',
        'Perfil limitado',
        'Hasta 3 consultas por mes'
      ],
      color: '#64B5F6',
      current: currentPlan === 'basic'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99/mes',
      features: [
        'Búsqueda avanzada de médicos',
        'Perfil completo con fotos',
        'Consultas ilimitadas',
        'Soporte prioritario',
        'Mensajería directa'
      ],
      color: Colors.primary,
      current: currentPlan === 'premium'
    },
    {
      id: 'professional',
      name: 'Profesional',
      price: '$19.99/mes',
      features: [
        'Todas las funciones Premium',
        'Perfil verificado',
        'Estadísticas avanzadas',
        'API de integración',
        'Soporte 24/7'
      ],
      color: '#FFB74D',
      current: currentPlan === 'professional'
    }
  ];

  const handleUpgrade = (planId: string) => {
    Alert.alert(
      'Cambiar Plan',
      `¿Deseas cambiar al plan ${plans.find(p => p.id === planId)?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar',
          onPress: () => {
            setCurrentPlan(planId);
            Alert.alert('Éxito', 'Plan actualizado correctamente');
          }
        }
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancelar Suscripción',
      '¿Estás seguro que deseas cancelar tu suscripción? Perderás el acceso a las funciones premium.',
      [
        { text: 'No cancelar', style: 'cancel' },
        { 
          text: 'Cancelar Suscripción',
          style: 'destructive',
          onPress: () => Alert.alert('Cancelada', 'Tu suscripción ha sido cancelada')
        }
      ]
    );
  };

  const PlanCard = ({ plan }: any) => (
    <View style={[styles.planCard, plan.current && styles.currentPlan]}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: plan.color }]}>
          <Ionicons 
            name={plan.current ? "checkmark-circle" : "radio-button-off"} 
            size={24} 
            color={Colors.textLight} 
          />
        </View>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
        </View>
        {!plan.current && (
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: plan.color }]}
            onPress={() => handleUpgrade(plan.id)}
          >
            <Text style={styles.upgradeButtonText}>Cambiar</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.featuresContainer}>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark" size={16} color={plan.color} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
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
        <Text style={styles.headerTitle}>Suscripción</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan Info */}
        <View style={styles.currentPlanInfo}>
          <Text style={styles.sectionTitle}>Plan Actual</Text>
          <View style={styles.billingCard}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Plan:</Text>
              <Text style={styles.billingValue}>
                {plans.find(p => p.current)?.name} {plans.find(p => p.current)?.price}
              </Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Próximo cobro:</Text>
              <Text style={styles.billingValue}>{billingInfo.nextBilling}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Método de pago:</Text>
              <Text style={styles.billingValue}>{billingInfo.method}</Text>
            </View>
          </View>
        </View>

        {/* Available Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Planes Disponibles</Text>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Cambiar Método de Pago</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="receipt-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Historial de Pagos</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCancelSubscription}>
            <Ionicons name="close-circle-outline" size={24} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Cancelar Suscripción</Text>
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
  sectionTitle: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 24,
  },
  currentPlanInfo: {
    marginBottom: 8,
  },
  billingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billingLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  billingValue: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  plansSection: {
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlan: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
  },
  planPrice: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  upgradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  actionsSection: {
    gap: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    color: Colors.textLight,
    fontSize: 16,
    marginLeft: 12,
  },
});

export default Subscription;
