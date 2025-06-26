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
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const Subscription: React.FC = () => {
    const insets = useSafeAreaInsets();
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [billingInfo, setBillingInfo] = useState({
    nextBilling: '15 Jul 2025',
    amount: '$9.99',
    method: 'Visa ****1234'
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
            color: Colors.neumorphicTextSecondary,
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
            color: Colors.neonGreen,
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

    const PlanCard = ({ plan }: { plan: any }) => (
        <View style={[styles.planCard, plan.current && styles.currentPlan]}>
            <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: plan.color }]}>
                    <Ionicons 
                        name={plan.current ? "checkmark-circle" : "radio-button-off"} 
                        size={24} 
                        color={Colors.neumorphicLight} 
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" backgroundColor={Colors.neumorphicBase} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 10 : 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
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
            <Ionicons name="card-outline" size={24} color={Colors.neumorphicText} />
            <Text style={styles.actionText}>Cambiar Método de Pago</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.neumorphicTextSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="receipt-outline" size={24} color={Colors.neumorphicText} />
            <Text style={styles.actionText}>Historial de Pagos</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.neumorphicTextSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCancelSubscription}>
            <Ionicons name="close-circle-outline" size={24} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Cancelar Suscripción</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.neumorphicTextSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

            {/* Bottom Overlay for Android Navigation Bar */}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neumorphicCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    color: Colors.neumorphicText,
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: Colors.neumorphicText,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 24,
  },
  currentPlanInfo: {
    marginBottom: 8,
  },
  billingCard: {
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billingLabel: {
    color: Colors.neumorphicTextSecondary,
    fontSize: 16,
  },
  billingValue: {
    color: Colors.neumorphicText,
    fontSize: 16,
    fontWeight: '600',
  },
  plansSection: {
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPlan: {
    borderColor: Colors.primary,
    backgroundColor: Colors.neumorphicCard,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    color: Colors.neumorphicText,
    fontSize: 18,
    fontWeight: '600',
  },
  planPrice: {
    color: Colors.neumorphicTextSecondary,
    fontSize: 14,
  },
  upgradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  upgradeButtonText: {
    color: Colors.neumorphicLight,
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
    color: Colors.neumorphicTextSecondary,
    fontSize: 14,
  },
  actionsSection: {
    gap: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    flex: 1,
    color: Colors.neumorphicText,
    fontSize: 16,
    marginLeft: 12,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 45 : 0,
    backgroundColor: '#212121',
  },
});

export default Subscription;
