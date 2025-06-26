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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';

const ChangePassword = () => {
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
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
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
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={onToggleVisibility}>
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={Colors.textSecondary} 
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={{ width: 40 }} />
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
          showPassword={showPasswords.current}
          onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
        />

        <PasswordField
          label="Nueva Contraseña"
          value={formData.newPassword}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, newPassword: text }))}
          placeholder="Ingresa tu nueva contraseña"
          showPassword={showPasswords.new}
          onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
        />

        <PasswordField
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
          placeholder="Confirma tu nueva contraseña"
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
                  color={req.met ? '#81C784' : Colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText,
                  { color: req.met ? '#81C784' : Colors.textSecondary }
                ]}>
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
          <Ionicons name="key-outline" size={24} color={Colors.textLight} />
          <Text style={styles.changeButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>

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
  inputContainer: {
    marginTop: 24,
  },
  inputLabel: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textLight,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
  },
  requirementsContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  requirementsTitle: {
    color: Colors.textLight,
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
  },
  changeButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePassword;
