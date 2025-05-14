# Doctor Lodgment App

Aplicación móvil para médicos que buscan alojamiento cercano a hospitales y centros médicos.

![Logo Doctor Lodgment](./assets/images/logo.jpeg)

## Descripción

Doctor Lodgment es una plataforma inspirada en Airbnb, diseñada específicamente para profesionales médicos. Permite a los médicos encontrar y reservar alojamientos cercanos a hospitales y centros médicos, especialmente útil durante rotaciones, especializaciones o trabajo temporal en diferentes ciudades.

## Características principales

- **Autenticación**: Registro e inicio de sesión seguros
- **Exploración de alojamientos**: Búsqueda y filtrado por ubicación, precio, cercanía a hospitales
- **Vista de mapa**: Visualización geográfica de alojamientos disponibles
- **Perfiles de usuario**: Para médicos y anfitriones
- **Reservas**: Sistema de reserva y gestión de estancias

## Tecnologías utilizadas

- React Native
- Expo
- TypeScript
- Expo Router para navegación
- Mapas interactivos con react-native-maps
- Integración con backend Node.js (DoctorLodgmentNODEjs)

## Estructura del proyecto

```
DoctorLodgmentApp/
├── app/                  # Rutas de navegación con Expo Router
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── constants/        # Constantes de la aplicación (colores, etc.)
│   ├── context/          # Contextos de React (AuthContext, etc.)
│   ├── navigation/       # Configuración de navegación
│   └── screens/          # Pantallas principales
├── assets/
│   ├── images/           # Imágenes e iconos, incluye logo.png
│   └── fonts/            # Fuentes personalizadas
└── package.json          # Dependencias del proyecto
```

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Instala las dependencias específicas para mapas y almacenamiento:
   ```
   npm install @react-native-async-storage/async-storage axios expo-location react-native-maps
   ```
4. Asegúrate de que el archivo `logo.jpeg` esté en la carpeta `assets/images/`

5. Inicia la aplicación:
   ```
   npx expo start
   ```

> **Nota**: Si encuentras problemas durante la instalación o al ejecutar la aplicación, consulta el archivo `TROUBLESHOOTING.md` para soluciones a problemas comunes.

## Pantallas principales

1. **Login**: Autenticación de usuarios
2. **SignUp**: Registro de nuevos usuarios
3. **Home**: Pantalla principal con listado de alojamientos y mapa
4. **Profile**: Perfil del usuario y configuración
5. **LodgmentDetail**: Detalles de un alojamiento específico (en desarrollo)

## Backend

Esta aplicación se conecta a un backend Node.js (DoctorLodgmentNODEjs) que proporciona:
- API REST para autenticación
- Gestión de usuarios
- Sistema de alojamientos
- Carga y gestión de imágenes

## Equipo de desarrollo

- José Chirinos (Desarrollador principal)

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
