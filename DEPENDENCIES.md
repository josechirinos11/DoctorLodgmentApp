# Dependencias para Doctor Lodgment App

Este archivo documenta las dependencias necesarias para ejecutar la aplicación Doctor Lodgment.

## Instalación de dependencias

Ejecutar el siguiente comando en el directorio raíz del proyecto:

```bash
npm install @react-native-async-storage/async-storage axios expo-location react-native-maps
```

## Dependencias principales

1. **@react-native-async-storage/async-storage**: Para almacenamiento persistente de datos como tokens JWT.
2. **axios**: Cliente HTTP para realizar solicitudes a la API.
3. **expo-location**: Para acceder a la ubicación del dispositivo.
4. **react-native-maps**: Para integrar mapas interactivos en la aplicación.

## Configuración adicional

### Para react-native-maps (Android)

Asegúrate de que tu archivo `app.json` tenga la siguiente configuración:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_API_KEY_DE_GOOGLE_MAPS"
        }
      }
    }
  }
}
```

### Para react-native-maps (iOS)

Para iOS, agrega en `app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_API_KEY_DE_GOOGLE_MAPS"
      }
    }
  }
}
```

## Preparación del logo

Coloca el archivo de imagen del logo en:
- `assets/images/logo.jpeg`

Asegúrate de que el logo tenga un fondo transparente para mejor integración en la UI. 