import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../../constants/Colors';

const ContactsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Dr. María García',
      specialty: 'Cardiología',
      hospital: 'Hospital Central',
      phone: '+57 300 123 4567',
      email: 'maria.garcia@hospital.com',
      isFavorite: true,
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Carlos Ruiz',
      specialty: 'Neurología',
      hospital: 'Clínica Norte',
      phone: '+57 301 234 5678',
      email: 'carlos.ruiz@clinica.com',
      isFavorite: false,
      isOnline: false
    },
    {
      id: '3',
      name: 'Dra. Ana López',
      specialty: 'Pediatría',
      hospital: 'Hospital Infantil',
      phone: '+57 302 345 6789',
      email: 'ana.lopez@infantil.com',
      isFavorite: true,
      isOnline: true
    }
  ]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'people-outline' },
    { id: 'favorites', name: 'Favoritos', icon: 'heart-outline' },
    { id: 'online', name: 'En línea', icon: 'radio-outline' },
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'favorites' && contact.isFavorite) ||
                           (selectedCategory === 'online' && contact.isOnline);
    return matchesSearch && matchesCategory;
  });

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.activeCategoryButton
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.id ? Colors.textLight : Colors.textSecondary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.activeCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const toggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, isFavorite: !contact.isFavorite } : contact
    ));
  };

  const renderContact = ({ item }: any) => (
    <TouchableOpacity style={styles.contactItem} activeOpacity={0.8}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map((n: string) => n[0]).join('')}
          </Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.contactContent}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons 
              name={item.isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isFavorite ? Colors.error : Colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="medical-outline" size={14} color={Colors.primary} />
            <Text style={styles.infoText}>{item.specialty}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{item.hospital}</Text>
          </View>
        </View>
        
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add-outline" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar contactos..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Contacts List */}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No hay contactos</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategory !== 'all'
                ? 'No se encontraron contactos con los filtros aplicados'
                : 'Agrega tu primer contacto médico'
              }
            </Text>
          </View>
        }
      />

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.textLight,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: Colors.textLight,
  },
  contactsList: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 60 : 40,
  },
  contactItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D4AA',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  contactContent: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  contactInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  actionText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
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

export default ContactsScreen;
