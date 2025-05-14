import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Colors from '../constants/Colors';

// Ancho de pantalla para cálculos de tamaño
const windowWidth = Dimensions.get('window').width;

// URL base del API
const API_URL = 'http://10.0.2.2:3000';

// Tipos para los alojamientos
type Lodgment = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  rating: number;
  user: {
    _id: string;
    name: string;
    profileImage: string;
  };
};

// Datos temporales para simular alojamientos (reemplazar con API real)
const MOCK_LODGMENTS: Lodgment[] = [
  {
    _id: '1',
    title: 'Apartamento céntrico para médicos',
    description: 'Apartamento moderno ideal para médicos que necesitan alojamiento durante su rotación. Acceso rápido a hospitales principales.',
    price: 120,
    location: {
      latitude: 43.2632,
      longitude: -2.9349,
      address: 'Calle Principal 123, Bilbao'
    },
    images: [
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=3087&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594540637720-9b14714212e4?q=80&w=3087&auto=format&fit=crop',
    ],
    rating: 4.8,
    user: {
      _id: '101',
      name: 'Ana Martínez',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    _id: '2',
    title: 'Estudio cerca del Hospital Universitario',
    description: 'Acogedor estudio a 5 minutos a pie del Hospital Universitario. Ideal para residentes médicos.',
    price: 85,
    location: {
      latitude: 43.2682,
      longitude: -2.9389,
      address: 'Avenida Hospital 456, Bilbao'
    },
    images: [
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?q=80&w=3000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=3087&auto=format&fit=crop',
    ],
    rating: 4.5,
    user: {
      _id: '102',
      name: 'Carlos Ruiz',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    _id: '3',
    title: 'Apartamento premium para profesionales médicos',
    description: 'Lujoso apartamento con todas las comodidades para profesionales de la salud. Cerca de las principales clínicas.',
    price: 150,
    location: {
      latitude: 43.2602,
      longitude: -2.9309,
      address: 'Gran Vía 789, Bilbao'
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=3000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940&auto=format&fit=crop',
    ],
    rating: 4.9,
    user: {
      _id: '103',
      name: 'María López',
      profileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  },
];

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [lodgments, setLodgments] = useState<Lodgment[]>(MOCK_LODGMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtrar alojamientos basado en la búsqueda
  const filteredLodgments = lodgments.filter(
    (lodgment) =>
      lodgment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lodgment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lodgment.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener ubicación del usuario
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se requiere permiso para acceder a la ubicación');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('No se pudo determinar tu ubicación');
        console.error(error);
      }
    })();
  }, []);

  // En una implementación real, aquí cargaríamos los alojamientos desde la API
  // useEffect(() => {
  //   const fetchLodgments = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${API_URL}/lodgments`);
  //       setLodgments(response.data);
  //     } catch (error) {
  //       console.error('Error fetching lodgments:', error);
  //       Alert.alert('Error', 'No se pudieron cargar los alojamientos');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchLodgments();
  // }, []);

  // Renderizar cada item de alojamiento
  const renderLodgmentItem = ({ item }: { item: Lodgment }) => (
    <TouchableOpacity 
      style={styles.lodgmentCard}
      onPress={() => Alert.alert('Ver detalles', `Detalles de: ${item.title}`)}
    >
      {/* Imagen principal */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles.lodgmentImage} 
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{item.price}€/noche</Text>
        </View>

        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Información del alojamiento */}
      <View style={styles.lodgmentInfo}>
        <View style={styles.infoHeader}>
          <Text style={styles.lodgmentTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.locationText} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} /> {item.location.address}
        </Text>

        <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
        
        {/* Host info */}
        <View style={styles.hostContainer}>
          <Image 
            source={{ uri: item.user.profileImage }} 
            style={styles.hostImage} 
          />
          <Text style={styles.hostName}>Anfitrión: {item.user.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Header component para la FlatList
  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hola, {user?.name || 'Doctor'}
        </Text>
        <Text style={styles.subtitleText}>
          Encuentra el mejor alojamiento para tu estancia médica
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ubicación, hospital, etc."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterOptions}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={18} color={Colors.primary} />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapToggleButton}
          onPress={() => setShowMap(!showMap)}
        >
          <Ionicons name={showMap ? "list-outline" : "map-outline"} size={18} color={Colors.primary} />
          <Text style={styles.mapToggleText}>{showMap ? "Ver lista" : "Ver mapa"}</Text>
        </TouchableOpacity>
      </View>

      {showMap && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude || 43.2632,
              longitude: location?.coords.longitude || -2.9349,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {filteredLodgments.map((lodgment) => (
              <Marker
                key={lodgment._id}
                coordinate={{
                  latitude: lodgment.location.latitude,
                  longitude: lodgment.location.longitude,
                }}
                title={lodgment.title}
                description={`${lodgment.price}€/noche`}
              >
                <View style={styles.markerContainer}>
                  <Text style={styles.markerText}>{lodgment.price}€</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      )}

      {!showMap && (
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Alojamientos disponibles</Text>
          <Text style={styles.resultCount}>{filteredLodgments.length} resultados</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando alojamientos...</Text>
        </View>
      ) : (
        <FlatList
          data={showMap ? [] : filteredLodgments}
          renderItem={renderLodgmentItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {/* Botón flotante para añadir nuevo alojamiento (solo para anfitriones) */}
      {user?.role === 'host' && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Nuevo alojamiento', 'Función para añadir un nuevo alojamiento')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Color de fondo verde claro para coincidir con el logo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    marginLeft: 5,
    color: Colors.primary,
    fontWeight: '500',
  },
  mapToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Color de fondo verde claro para coincidir con el logo
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapToggleText: {
    marginLeft: 5,
    color: Colors.primary,
    fontWeight: '500',
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  lodgmentCard: {
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: Colors.background,
    borderRadius: 15,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  lodgmentImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  priceTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  lodgmentInfo: {
    padding: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  lodgmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    width: '80%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  hostName: {
    fontSize: 14,
    color: Colors.text,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Home; 