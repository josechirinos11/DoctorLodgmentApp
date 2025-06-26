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
import { useAuth } from '../context/AuthContext';

const EditProfile: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    idNumber: user?.idNumber || ''
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

  const handleSave = () => {
    Alert.alert(
      'Guardar Cambios',
      '¿Deseas guardar los cambios realizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Guardar', 
          onPress: () => {
            // Aquí iría la lógica para guardar los datos
            Alert.alert('Éxito', 'Datos actualizados correctamente');
            router.back();
          }
        }
      ]
    );
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false, icon }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    icon?: string;
  }) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
          {icon && (
            <View style={styles.inputIconContainer}>
              <Ionicons name={icon as any} size={20} color={Colors.neumorphicTextSecondary} />
            </View>
          )}
          <TextInput
            style={[styles.textInput, multiline && styles.textArea, icon && styles.textInputWithIcon]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.neumorphicTextSecondary}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor={Colors.neumorphicBase} />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 10 : 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <InputField
            label="Nombre"
            value={formData.name}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Ingresa tu nombre"
            icon="person-outline"
          />

          <InputField
            label="Apellido"
            value={formData.lastName}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, lastName: text }))}
            placeholder="Ingresa tu apellido"
            icon="person-outline"
          />

          <InputField
            label="Cédula/ID"
            value={formData.idNumber}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, idNumber: text }))}
            placeholder="Número de identificación"
            icon="card-outline"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="tu@email.com"
            icon="mail-outline"
          />

          <InputField
            label="Teléfono"
            value={formData.phone}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, phone: text }))}
            placeholder="+1 234 567 8900"
            icon="call-outline"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          
          <InputField
            label="Dirección"
            value={formData.address}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Tu dirección completa"
            icon="home-outline"
            multiline={true}
          />

          <InputField
            label="Ciudad"
            value={formData.city}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, city: text }))}
            placeholder="Tu ciudad"
            icon="location-outline"
          />

          <InputField
            label="País"
            value={formData.country}
            onChangeText={(text: string) => setFormData(prev => ({ ...prev, country: text }))}
            placeholder="Tu país"
            icon="globe-outline"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

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
    color: Colors.neumorphicText,
    fontSize: 20,
    fontWeight: '700',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 22,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: Colors.neumorphicLight,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight,
  },
  sectionTitle: {
    color: Colors.neumorphicText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.neumorphicText,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neumorphicBase,
    borderRadius: 14,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.neumorphicText,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  textInputWithIcon: {
    paddingLeft: 0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
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

export default EditProfile;
