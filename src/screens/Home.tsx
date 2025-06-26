import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Noticiasdiarias from "../components/Noticiasdiarias";
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");
const adjustedHeight = height - 0; // Ajustar altura para evitar problemas con la barra de estado

// Altura del bottomOverlay que debemos restar del total
const BOTTOM_OVERLAY_HEIGHT = Platform.OS === "android" ? 45 : 0;

// Definir porcentajes exactos de altura para cada componente
// Modo normal (mapa compacto + hospedajes)
const MAP_HEIGHT_PERCENTAGE_COMPACT = 0.3; // 30%
const ACCOMMODATIONS_HEIGHT_PERCENTAGE = 0.560; // 58.5%
const BOTTOM_MENU_HEIGHT_PERCENTAGE = 0.045; // 4.5%
const ANDROID_BAR_HEIGHT_PERCENTAGE = 0.045; // 4.5%

// Modo expandido (solo mapa)
const MAP_HEIGHT_PERCENTAGE_EXPANDED = 0.95; // 95%

// Calcular alturas exactas en pixels
const SAFEAREA_HEIGHT = adjustedHeight; // 100% de la pantalla
const MAP_HEIGHT_COMPACT = adjustedHeight * MAP_HEIGHT_PERCENTAGE_COMPACT;
const MAP_HEIGHT_EXPANDED = adjustedHeight * MAP_HEIGHT_PERCENTAGE_EXPANDED;
const ACCOMMODATIONS_HEIGHT = adjustedHeight * ACCOMMODATIONS_HEIGHT_PERCENTAGE;
const BOTTOM_MENU_HEIGHT = adjustedHeight * BOTTOM_MENU_HEIGHT_PERCENTAGE;
const ANDROID_BAR_HEIGHT = adjustedHeight * ANDROID_BAR_HEIGHT_PERCENTAGE;

type LocationData = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const Home = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredZones, setFilteredZones] = useState<
    Array<{ id: string; name: string; country: string }>
  >([]);

  // Lista de zonas disponibles
  const availableZones = [
    { id: "1", name: "Valencia", country: "España" },
    { id: "2", name: "Valencia", country: "Venezuela" },
    { id: "3", name: "Madrid", country: "España" },
    { id: "4", name: "Barcelona", country: "España" },
    { id: "5", name: "Caracas", country: "Venezuela" },
    { id: "6", name: "Maracaibo", country: "Venezuela" },
    { id: "7", name: "Sevilla", country: "España" },
    { id: "8", name: "Bilbao", country: "España" },
  ];

  const insets = useSafeAreaInsets();
  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Filtrar zonas según el texto de búsqueda
    if (searchText.trim() === "") {
      setFilteredZones([]);
    } else {
      const filtered = availableZones.filter(
        (zone) =>
          zone.name.toLowerCase().includes(searchText.toLowerCase()) ||
          zone.country.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredZones(filtered);
    }
  }, [searchText]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos de ubicación",
          "La aplicación necesita acceso a la ubicación para mostrar el mapa."
        );
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación actual");
    } finally {
      setIsLoadingLocation(false);
    }
  };
  const handleUser = () => {
    router.push("/user-profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleMessages = () => {
    Alert.alert("Mensajes", "Función de mensajes en desarrollo");
  };

  const handleContacts = () => {
    Alert.alert("Contactos", "Función de contactos en desarrollo");
  };
  const handleConferences = () => {
    Alert.alert(
      "Congresos",
      "Función de congresos y reuniones científicas en desarrollo"
    );
  };
  const handleFilter = () => {
    setIsMenuExpanded(!isMenuExpanded);

    // Limpiar búsqueda al cerrar
    if (isMenuExpanded) {
      setSearchText("");
    }
  };

  const handleZoneSelect = (zone: {
    id: string;
    name: string;
    country: string;
  }) => {
    Alert.alert("Zona seleccionada", `${zone.name}, ${zone.country}`, [
      {
        text: "Buscar aquí",
        onPress: () => {
          console.log("Buscar en:", zone);
          // Aquí puedes agregar la lógica para cambiar la ubicación del mapa
          setSearchText("");
          setIsMenuExpanded(false);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Menú flotante Iconos */}
      <View style={styles.floatingIconsContainer}>
        {/* Icono de filtro */}
        <TouchableOpacity
          style={styles.floatingMenuItem}
          onPress={handleFilter}
        >
          <View style={styles.filterIconBackground}>
            <Ionicons
              name={isMenuExpanded ? "close-outline" : "filter-outline"}
              size={24}
              color={Colors.primary}
            />
          </View>
        </TouchableOpacity>
        {/* Icono de usuario */}
        <TouchableOpacity style={styles.floatingMenuItem} onPress={handleUser}>
          <View style={styles.userIconBackground}>
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
          </View>
        </TouchableOpacity>
        {/* Icono de configuraciones */}
        <TouchableOpacity
          style={styles.floatingMenuItem}
          onPress={handleSettings}
        >
          <View style={styles.settingsIconBackground}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={Colors.primary}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* Área expandible separada */}
      {isMenuExpanded && (
        <View style={styles.expandedMenuContainer}>
          <View style={styles.expandedContent}>
            {/* Input de búsqueda */}
            <TextInput
              style={styles.searchInput}
              placeholder="Escribe una ciudad o país..."
              placeholderTextColor={Colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {/* Lista de zonas filtradas */}
            {filteredZones.length > 0 && (
              <FlatList
                data={filteredZones}
                keyExtractor={(item) => item.id}
                style={styles.zonesList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.zoneItem}
                    onPress={() => handleZoneSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.zoneItemContent}>
                      <Text style={styles.zoneName}>{item.name}</Text>
                      <Text style={styles.zoneCountry}>{item.country}</Text>
                    </View>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
            {/* Mensaje cuando no hay resultados */}
            {searchText.trim() !== "" && filteredZones.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No se encontraron zonas
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      {/* Mapa principal - tamaño condicional */}
      <View
        style={[
          styles.mapContainer,
          isMenuExpanded
            ? styles.mapContainerExpanded
            : styles.mapContainerCompact,
        ]}
      >
        {isLoadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
          </View>
        ) : location ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={location}
            showsUserLocation={true}
            showsMyLocationButton={true}
            zoomEnabled={true}
            scrollEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Tu ubicación"
              description="Estás aquí"
            />
          </MapView>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons
              name="location-outline"
              size={48}
              color={Colors.textSecondary}
            />
            <Text style={styles.errorText}>
              No se pudo obtener la ubicación
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Contenedor de hospedajes - solo visible cuando el mapa está en modo compacto */}
      {!isMenuExpanded && (
        <View style={styles.neumorphicOuterShadow}>
          <View style={styles.accommodationsContainerNeumorphicFullFixed}>
            <View style={styles.accommodationsHeader}>
              <Text style={styles.accommodationsTitle}>
                Hospedajes en la zona
              </Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Ver todos</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
            {/* Lista de hospedajes */}
            <FlatList
              data={[
                {
                  id: "1",
                  name: "Hotel Doctor Plaza",
                  rating: 4.5,
                  price: "$120/noche",
                  distance: "0.2 km",
                },
                {
                  id: "2",
                  name: "Medical Suites",
                  rating: 4.3,
                  price: "$95/noche",
                  distance: "0.5 km",
                },
                {
                  id: "3",
                  name: "Hospital Inn",
                  rating: 4.7,
                  price: "$150/noche",
                  distance: "0.8 km",
                },
              ]}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accommodationsListFull}
              style={{ flexGrow: 1 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.accommodationCardNeumorphic}
                  activeOpacity={0.7}
                >
                  <View style={styles.accommodationImagePlaceholder}>
                    <Ionicons
                      name="bed-outline"
                      size={32}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={styles.accommodationInfo}>
                    <Text style={styles.accommodationName}>{item.name}</Text>
                    <View style={styles.accommodationDetails}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
      {/* Menu inferior - posición dinámica según el estado del mapa */}
      <View
        style={[
          styles.bottomMenu,
          isMenuExpanded ? styles.bottomMenuExpanded : styles.bottomMenuCompact,
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleMessages}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={32}
              color={Colors.primary}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleContacts}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={32} color={Colors.primary} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleConferences}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="school-outline" size={32} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
      {/* Barra Noticia */}
      <Noticiasdiarias />
      {/* Barra inferior Android - ahora parte del flujo normal */}
      {/* View absoluto inferior para cubrir la zona de navegación */}
      <View style={styles.bottomOverlay} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "android" ? 45 : 0, // Franja más delgada para cubrir zona de navegación
    backgroundColor: "#212121", // Negro para coincidir con la barra de navegación
  },
  container: {
    height: SAFEAREA_HEIGHT, // 100% de la pantalla usando Dimensions
    width: width, // 100% del ancho
    backgroundColor: Colors.neumorphicBase, // Fondo neomórfico en lugar de surfaceGray
  },
  floatingMenu: {
    position: "absolute",
    top: 50,
    zIndex: 1000,
    backgroundColor: "rgba(33, 33, 33, 0.9)",
    borderRadius: 25,
    elevation: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6.27,
  },
  // Contenedor fijo para los iconos
  floatingIconsContainer: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 1001,
    backgroundColor: Colors.neumorphicBase, // Base neomórfica consistente
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "column",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    // Sombra clara (arriba-izquierda) - neomorfismo
    shadowColor: Colors.neumorphicLight,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    // Sombra oscura (abajo-derecha) - neomorfismo
    elevation: 10, // Para Android
    borderWidth: 1,
    borderColor: Colors.neumorphicLight,
  },

  // Contenedor para el área expandida
  expandedMenuContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 88,
    zIndex: 1000,
    backgroundColor: Colors.neumorphicBase, // Gris claro neomorfismo
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 8,
    maxHeight: 400,
    // Neomorfismo: sombra clara arriba-izquierda (iOS)
    shadowColor: Colors.neumorphicLight, // "#FFFFFF"
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    // Sombra oscura abajo-derecha (simulada por elevation en Android)
    elevation: 10, // Para Android
    borderWidth: 1,
    borderColor: Colors.primary, // Borde verde para coherencia con tu tema
    borderTopWidth: 1, // Línea superior
    borderTopColor: Colors.primary,
  },

  floatingMenuCollapsed: {
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 56, // Ancho fijo para el menú colapsado
  },
  floatingMenuExpanded: {
    left: 16, // Espacio a la izquierda
    right: 16, // Espacio a la derecha
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxHeight: 400, // Altura máxima para evitar que se salga de pantalla
  },
  mainIconsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  mainIconsContainerExpanded: {
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    right: 16, // Alineado con el borde derecho del menú expandido
    top: 16, // Alineado con el padding superior
    zIndex: 10,
  },
  expandedContent: {
    flex: 1,
    paddingTop: 0, // Sin padding superior
    paddingRight: 0, // Sin padding derecho ya que está en contenedor separado
    paddingLeft: 0, // Sin padding izquierdo
  },
  floatingMenuItem: {
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIconBackground: {
    width: 40,
    height: 40,
    backgroundColor: Colors.neumorphicCard, // Uso de color neomórfico consistente
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.neumorphicDark, // Color neomórfico para sombras
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
    elevation: 8, // Para Android
  },
  userIconBackground: {
    width: 40,
    height: 40,
    backgroundColor: Colors.neumorphicCard, // Uso de color neomórfico consistente
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.neumorphicDark, // Color neomórfico para sombras
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
    elevation: 8, // Para Android
  },
  settingsIconBackground: {
    width: 40,
    height: 40,
    backgroundColor: Colors.neumorphicCard, // Uso de color neomórfico consistente
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.neumorphicDark, // Color neomórfico para sombras
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
    elevation: 8, // Para Android
  },
  mapContainer: {
    backgroundColor: Colors.transparente,
    // Estilo base para el contenedor del mapa (sin flex para permitir height específico)
    borderRadius: 0,
    overflow: "hidden",
    margin: 0,
     borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  retryButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "500",
  },
  bottomMenu: {
    position: "absolute",
    zIndex: 1001,
    height: 200, // Altura aumentada para permitir espaciado entre iconos
    flexDirection: "column",
    backgroundColor: Colors.transparente,
    alignItems: "center", // Centra verticalmente los iconos
    justifyContent: "space-evenly", // Distribuye el espacio uniformemente
    borderTopWidth: 0,
    borderTopColor: Colors.red,
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomMenuCompact: {
    top: 50,
    left: 16,
  },
  bottomMenuExpanded: {
    top: 250,
    right: 23,
  },
  menuItem: {
    marginVertical: 8, // Espaciado similar al menú flotante (aumentado a 8px)
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neumorphicCard, // Color neomórfico consistente
    borderRadius: 20,
    shadowColor: Colors.neumorphicDark, // Sombra neomórfica
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
    elevation: 8, // Para Android
  },
  menuText: {
    fontSize: 11,
    color: Colors.secondary,
    marginTop: 4,
    fontWeight: "600",
    textAlign: "center",
  }, // Estilos para el área de búsqueda
  searchInput: {
    backgroundColor: Colors.neumorphicCard, // Fondo neomórfico
    borderRadius: 12,
    paddingHorizontal: 12, // Reducido de 16 a 12
    paddingVertical: 10, // Reducido de 12 a 10
    marginTop: 4, // Reducido margen superior
    marginBottom: 8, // Reducido margen inferior
    marginHorizontal: 0, // Sin margen horizontal para ocupar todo el ancho
    fontSize: 16,
    color: Colors.neumorphicText, // Texto neomórfico
    borderWidth: 1,
    borderColor: Colors.neumorphicLight, // Borde neomórfico
    textAlign: "left",
    // Efecto neomórfico hundido
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  zonesList: {
    maxHeight: 250, // Altura un poco más grande
    marginTop: 4,
  },
  zoneItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8, // Padding vertical más pequeño para hacerlos más delgados
    paddingHorizontal: 12, // Padding horizontal más pequeño
    marginVertical: 1, // Margen vertical más pequeño
    marginHorizontal: 0, // Sin margen horizontal para ocupar todo el ancho
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Fondo más sutil
    borderRadius: 6, // Bordes menos redondeados
    minHeight: 44, // Altura mínima más pequeña
  },
  zoneItemContent: {
    flex: 1,
    paddingRight: 8, // Espacio entre el texto y el icono
  },
  zoneName: {
    color: Colors.textLight,
    fontSize: 15, // Fuente un poco más pequeña
    fontWeight: "500", // Peso de fuente más ligero
    lineHeight: 18,
  },
  zoneCountry: {
    color: Colors.textSecondary,
    fontSize: 13, // Fuente más pequeña
    marginTop: 1,
    lineHeight: 16,
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noResultsText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
  }, // Estilos condicionales para el mapa
  mapContainerExpanded: {
    // Cuando el menú está expandido, el mapa ocupa 95% de la pantalla
    height: MAP_HEIGHT_EXPANDED,
    borderRadius: 0,
    overflow: "hidden",
    margin: 0,
  },
  mapContainerCompact: {
    // Cuando el menú está cerrado, el mapa ocupa exactamente 30% de la pantalla
    height: MAP_HEIGHT_COMPACT,
    borderRadius: 32,
    overflow: "hidden",
    margin: 10,
    elevation: 8,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  // Estilos para el contenedor de hospedajes
  neumorphicOuterShadow: {
    height: ACCOMMODATIONS_HEIGHT, // 50% del área disponible (sin bottomOverlay)
    borderRadius: 32,
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
    shadowColor: Colors.neumorphicLight,
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    backgroundColor: Colors.transparente, // Transparente para que solo se vea la sombra
    elevation: 12,
  },
  accommodationsContainerNeumorphicFullFixed: {
    height: ACCOMMODATIONS_HEIGHT, // 50% del área disponible (sin bottomOverlay)
    backgroundColor: Colors.neumorphicBase,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16, // Padding normal, sin espacio extra para menús absolutos
    marginHorizontal: 0,
    marginBottom: 0,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: Colors.neumorphicLight,
  },
  accommodationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  accommodationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  accommodationsListFull: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  accommodationCard: {
    width: 200,
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accommodationCardNeumorphic: {
    width: 200,
    backgroundColor: Colors.neumorphicCard,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    // Sombra neomórfica doble
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    // Sombra clara para efecto de profundidad
    borderWidth: 1,
    borderColor: Colors.neumorphicLight,
  },
  accommodationImagePlaceholder: {
    height: 120,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  accommodationInfo: {
    padding: 12,
  },
  accommodationName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  accommodationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});

export default Home;
