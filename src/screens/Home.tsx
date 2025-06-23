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
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

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
      <StatusBar style="light" backgroundColor={Colors.secondary} />{" "}
      {/* Menú flotante - contenedor de iconos fijo */}
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
        </TouchableOpacity>{" "}
        {/* Icono de usuario */}
        <TouchableOpacity style={styles.floatingMenuItem} onPress={handleUser}>
          <View style={styles.userIconBackground}>
            <Ionicons
              name="person-outline"
              size={24}
              color={Colors.primary}
            />
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
        </TouchableOpacity>{" "}
      </View>{" "}
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
            )}{" "}
          </View>{" "}
        </View>
      )}
      {/* Mapa principal - pantalla completa */}
      <View style={styles.mapContainer}>
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
      </View>{" "}
      {/* Menu inferior */}
      <View
        style={[
          styles.bottomMenu,
          {
            paddingBottom: Math.max(
              insets.bottom + (Platform.OS === "android" ? 8 : 0),
              16
            ),
          },
        ]}
      >
        {" "}
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
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "android" ? 45 : 0,
          backgroundColor: "#212121", // Cambia este color
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary, // Fondo negro para combinar con la navegación
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
  backgroundColor: Colors.background, // Fondo gris clarito típico neumorfismo
  borderRadius: 25,
  paddingVertical: 12,
  paddingHorizontal: 8,
  flexDirection: "column",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: Colors.primary,
  // Sombra clara (arriba-izquierda)
  shadowColor: "#fff",
  shadowOffset: { width: -4, height: -4 },
  shadowOpacity: 1,
  shadowRadius: 8,
  // Sombra oscura (abajo-derecha)
  elevation: 10, // Para Android
  // Truco: Puedes poner border para el bisel característico neumorfismo
  borderWidth: 1,
  borderColor: Colors.primary,
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
  backgroundColor: "#fff",          // Fondo blanco igual que los demás
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#b8c6db",
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f3",
  elevation: 8, // Para Android
  },
  userIconBackground: {
  width: 40,
  height: 40,
  backgroundColor: "#fff",          // Fondo blanco igual que los demás
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#b8c6db",
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f3",
  elevation: 8, // Para Android
  },
  settingsIconBackground: {
  width: 40,
  height: 40,
  backgroundColor: "#fff",          // Fondo blanco igual que los demás
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#b8c6db",
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f3",
  elevation: 8, // Para Android
  },
  mapContainer: {
    flex: 1,
    borderRadius: 0,
    overflow: "hidden",
    margin: 0,
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
    flexDirection: "row",
    backgroundColor: Colors.background,
  justifyContent: "space-around",
  borderTopWidth: 1,
  borderTopColor: Colors.primary,
  paddingVertical: 6, // Mucho menos padding vertical
  paddingHorizontal: 0, // Sin padding horizontal extra
  elevation: 0,         // Sin sombra ni elevación
  shadowColor: "transparent",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  paddingVertical: 0, // Sin padding
  paddingHorizontal: 0,
  borderRadius: 0,
  minWidth: 0,
  backgroundColor: "transparent", // Sin fondo
  elevation: 0,
  shadowColor: "transparent",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  },
  iconContainer: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 20,
  shadowColor: "#b8c6db", // Azul-gris claro (sombra principal)
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  borderWidth: 1,
  borderColor: "#f0f0f3",
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
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12, // Reducido de 16 a 12
    paddingVertical: 10, // Reducido de 12 a 10
    marginTop: 4, // Reducido margen superior
    marginBottom: 8, // Reducido margen inferior
    marginHorizontal: 0, // Sin margen horizontal para ocupar todo el ancho
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
    textAlign: "left",
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
  },
});

export default Home;
