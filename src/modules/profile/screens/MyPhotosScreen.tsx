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
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../constants/Colors';

const { width, height } = Dimensions.get('window');
const photoSize = (width - 48) / 3; // 3 columnas con espaciado

const MyPhotosScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
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
                color={Colors.neumorphicLight} 
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
                color={selectedFilter === item.id ? Colors.neumorphicLight : Colors.neumorphicTextSecondary} 
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" backgroundColor={Colors.neumorphicBase} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 10 : 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.neumorphicText} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Fotos</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
                    <Ionicons name="add" size={24} color={Colors.neumorphicLight} />
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
                <Ionicons name="camera-outline" size={64} color={Colors.neumorphicTextSecondary} />
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
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primaryDark,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.neumorphicCard,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        justifyContent: 'space-around',
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -4,
            height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    filtersContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    filtersList: {
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.neumorphicCard,
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -2,
            height: -2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        gap: 6,
    },
    activeFilter: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primaryDark,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    filterText: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    activeFilterText: {
        color: Colors.neumorphicLight,
    },
    photosGrid: {
        padding: 20,
    },
    photoRow: {
        justifyContent: 'space-between',
    },
    photoContainer: {
        width: photoSize,
        height: photoSize,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: Colors.neumorphicCard,
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -3,
            height: -3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
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
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 6,
        shadowColor: Colors.primaryDark,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        backgroundColor: Colors.neumorphicCard,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        shadowColor: Colors.neumorphicDark,
        shadowOffset: {
            width: -4,
            height: -4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyText: {
        color: Colors.neumorphicText,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        letterSpacing: 0.3,
    },
    emptySubtext: {
        color: Colors.neumorphicTextSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 32,
        lineHeight: 20,
        fontWeight: '400',
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

export default MyPhotosScreen;
