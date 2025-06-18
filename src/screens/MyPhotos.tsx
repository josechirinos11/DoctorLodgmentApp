import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const photoSize = (width - 48) / 3; // 3 columnas con espaciado

const MyPhotos = () => {
  const [photos, setPhotos] = useState([
    { id: '1', uri: 'https://picsum.photos/400/400?random=1', type: 'profile' },
    { id: '2', uri: 'https://picsum.photos/400/400?random=2', type: 'gallery' },
    { id: '3', uri: 'https://picsum.photos/400/400?random=3', type: 'gallery' },
    { id: '4', uri: 'https://picsum.photos/400/400?random=4', type: 'document' },
    { id: '5', uri: 'https://picsum.photos/400/400?random=5', type: 'gallery' },
    { id: '6', uri: 'https://picsum.photos/400/400?random=6', type: 'gallery' },
  ]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.secondary);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const filters = [
    { id: 'all', name: 'Todas', icon: 'images-outline' },
    { id: 'profile', name: 'Perfil', icon: 'person-circle-outline' },
    { id: 'gallery', name: 'Galería', icon: 'camera-outline' },
    { id: 'document', name: 'Documentos', icon: 'document-outline' },
  ];

  const filteredPhotos = selectedFilter === 'all' 
    ? photos 
    : photos.filter(photo => photo.type === selectedFilter);

  const handleAddPhoto = () => {
    Alert.alert(
      'Agregar Foto',
      'Selecciona una opción',
      [
        { text: 'Cámara', onPress: () => Alert.alert('Cámara', 'Funcionalidad en desarrollo') },
        { text: 'Galería', onPress: () => Alert.alert('Galería', 'Funcionalidad en desarrollo') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handlePhotoPress = (photo: any) => {
    Alert.alert(
      'Opciones de Foto',
      '',
      [
        { text: 'Ver', onPress: () => Alert.alert('Ver', 'Funcionalidad en desarrollo') },
        { text: 'Editar', onPress: () => Alert.alert('Editar', 'Funcionalidad en desarrollo') },
        { text: 'Eliminar', style: 'destructive', onPress: () => handleDeletePhoto(photo.id) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro que deseas eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => prev.filter(photo => photo.id !== photoId));
            Alert.alert('Eliminado', 'Foto eliminada correctamente');
          }
        }
      ]
    );
  };

  const getPhotoTypeIcon = (type: string) => {
    switch (type) {
      case 'profile': return 'person-circle';
      case 'gallery': return 'camera';
      case 'document': return 'document';
      default: return 'image';
    }
  };

  const renderPhoto = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.photoContainer}
      onPress={() => handlePhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.photoOverlay}>
        <Ionicons 
          name={getPhotoTypeIcon(item.type)} 
          size={16} 
          color={Colors.textLight} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item.id && styles.activeFilter
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedFilter === item.id ? Colors.textLight : Colors.textSecondary} 
      />
      <Text style={[
        styles.filterText,
        selectedFilter === item.id && styles.activeFilterText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Fotos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <Ionicons name="add" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{photos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{photos.filter(p => p.type === 'profile').length}</Text>
          <Text style={styles.statLabel}>Perfil</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{photos.filter(p => p.type === 'gallery').length}</Text>
          <Text style={styles.statLabel}>Galería</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{photos.filter(p => p.type === 'document').length}</Text>
          <Text style={styles.statLabel}>Documentos</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={renderFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Photos Grid */}
      <FlatList
        data={filteredPhotos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.photosGrid}
        columnWrapperStyle={styles.photoRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="camera-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No hay fotos</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' 
                ? 'Agrega tu primera foto tocando el botón +'
                : `No hay fotos en la categoría ${filters.find(f => f.id === selectedFilter)?.name}`
              }
            </Text>
          </View>
        }
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filtersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.textLight,
  },
  photosGrid: {
    padding: 16,
  },
  photoRow: {
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: photoSize,
    height: photoSize,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
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
});

export default MyPhotos;
