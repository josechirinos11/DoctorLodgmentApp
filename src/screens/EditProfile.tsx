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
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();  const [formData, setFormData] = useState({
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
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
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

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <InputField
          label="Nombre"
          value={formData.name}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ingresa tu nombre"
        />

        <InputField
          label="Apellido"
          value={formData.lastName}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, lastName: text }))}
          placeholder="Ingresa tu apellido"
        />

        <InputField
          label="Email"
          value={formData.email}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="tu@email.com"
        />

        <InputField
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="+1 234 567 8900"
        />

        <InputField
          label="Cédula/ID"
          value={formData.idNumber}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, idNumber: text }))}
          placeholder="Número de identificación"
        />

        <InputField
          label="Dirección"
          value={formData.address}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, address: text }))}
          placeholder="Tu dirección"
        />

        <InputField
          label="Ciudad"
          value={formData.city}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, city: text }))}
          placeholder="Tu ciudad"
        />

        <InputField
          label="País"
          value={formData.country}
          onChangeText={(text: string) => setFormData(prev => ({ ...prev, country: text }))}
          placeholder="Tu país"
        />

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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  saveButtonText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textLight,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfile;
