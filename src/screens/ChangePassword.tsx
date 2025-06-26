import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const ChangePassword = () => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
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

  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    Alert.alert(
      'Cambiar Contraseña',
      '¿Estás seguro que deseas cambiar tu contraseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cambiar', 
          onPress: () => {
            // Aquí iría la lógica para cambiar la contraseña
            Alert.alert(
              'Éxito', 
              'Contraseña cambiada correctamente',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  const PasswordField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    onToggleVisibility 
  }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.neumorphicTextSecondary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={onToggleVisibility}>
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const validatePassword = (password: string) => {
    const requirements = [
      { text: 'Al menos 6 caracteres', met: password.length >= 6 },
      { text: 'Al menos una letra mayúscula', met: /[A-Z]/.test(password) },
      { text: 'Al menos una letra minúscula', met: /[a-z]/.test(password) },
      { text: 'Al menos un número', met: /\d/.test(password) },
    ];
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.newPassword);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top + 5 : insets.top + 10 }]}>
      
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color={Colors.neumorphicText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
        </Text>

        <PasswordField
          label="Contraseña Actual"
          value={formData.currentPassword}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, currentPassword: text }))}
          placeholder="Ingresa tu contraseña actual"
          placeholderTextColor={Colors.neumorphicTextSecondary}
          showPassword={showPasswords.current}
          onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
        />

        <PasswordField
          label="Nueva Contraseña"
          value={formData.newPassword}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, newPassword: text }))}
          placeholder="Ingresa tu nueva contraseña"
          placeholderTextColor={Colors.neumorphicTextSecondary}
          showPassword={showPasswords.new}
          onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
        />

        <PasswordField
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          placeholder="Confirma tu nueva contraseña"
          placeholderTextColor={Colors.neumorphicTextSecondary}
          showPassword={showPasswords.confirm}
          onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
        />

        {/* Password Requirements */}
        {formData.newPassword.length > 0 && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requisitos de la contraseña:</Text>
            {passwordRequirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons 
                  name={req.met ? "checkmark-circle" : "radio-button-off"} 
                  size={16} 
                  color={req.met ? '#81C784' : Colors.neumorphicTextSecondary} 
                />
                <Text style={[
                  styles.requirementText,
                  { color: req.met ? '#81C784' : Colors.neumorphicTextSecondary }
                ]}>
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
          <Ionicons name="key-outline" size={24} color={Colors.neumorphicBase} />
          <Text style={styles.changeButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Bottom overlay for Android navigation bar */}
      {Platform.OS === 'android' && (
        <View style={styles.bottomOverlay} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    bottomOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: Platform.OS === "android" ? 45 : 0,
      backgroundColor: "#212121",
    },
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
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neumorphicBase,
    // Sombra clara (arriba y izquierda) - efecto neumórfico
    shadowColor: Colors.neumorphicLight,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neumorphicText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    color: Colors.neumorphicTextSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 24,
  },
  inputLabel: {
    color: Colors.neumorphicText,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 12,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.neumorphicText,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
    borderRadius: 8,
  },
  requirementsContainer: {
    marginTop: 24,
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  requirementsTitle: {
    color: Colors.neumorphicText,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    gap: 8,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButtonText: {
    color: Colors.neumorphicBase,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePassword;
