# Solución de Problemas

## Error al iniciar la aplicación

### 1. Error: Unable to resolve "../../assets/images/logo.png" from "src\components\Logo.tsx"

Este error ocurre porque la aplicación está buscando un archivo de imagen que no existe en la ruta especificada.

**Solución:**
- Asegúrate de que el archivo `logo.jpeg` esté en la carpeta `assets/images/`.
- Si el error persiste, verifica que el componente Logo esté importando el archivo correcto:
  ```jsx
  // En src/components/Logo.tsx
  const logoImage: ImageSourcePropType = require('../../assets/images/logo.jpeg');
  ```

### 2. Problemas con dependencias

Si al iniciar la aplicación aparecen errores relacionados con módulos faltantes, es probable que falten dependencias.

**Solución:**
- Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
  ```bash
  npm install
  ```
- Para instalar dependencias específicas:
  ```bash
  npm install @react-native-async-storage/async-storage axios expo-location react-native-maps
  ```

### 3. Error: Cannot find module 'react-native-maps'

Este error ocurre cuando no se ha instalado correctamente la dependencia de mapas.

**Solución:**
- Instala react-native-maps:
  ```bash
  npm install react-native-maps
  ```
- Si estás usando un emulador de Android, asegúrate de tener Google Play Services instalado.

### 4. Problemas con PowerShell y la ejecución de scripts

Si ves errores como "la ejecución de scripts está deshabilitada en este sistema" al intentar ejecutar comandos npm:

**Solución:**
- Abre PowerShell como administrador
- Ejecuta el siguiente comando para permitir la ejecución de scripts:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
- Intenta nuevamente instalar las dependencias

### 5. Problemas al iniciar el emulador

Si tienes problemas para iniciar el emulador de Android o iOS:

**Solución:**
- Para Android, asegúrate de tener Android Studio instalado y un emulador configurado.
- Para iOS (solo en macOS), asegúrate de tener Xcode instalado.
- Alternativamente, usa Expo Go en tu dispositivo físico escaneando el código QR que aparece al ejecutar `npx expo start`. 