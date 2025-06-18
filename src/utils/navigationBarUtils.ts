import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import Colors from '../constants/Colors';

/**
 * Configura la barra de navegación del sistema (Android)
 * para que tenga el color negro consistente con el diseño de la app
 */
export const configureNavigationBar = async () => {
  if (Platform.OS === 'android') {
    try {
      // Establecer el color de fondo de la barra de navegación
      await NavigationBar.setBackgroundColorAsync(Colors.secondary);
      
      // Establecer el estilo de los botones (light para fondo oscuro)
      await NavigationBar.setButtonStyleAsync('light');
      
      console.log('Barra de navegación configurada correctamente');
    } catch (error) {
      console.warn('Error configurando la barra de navegación:', error);
    }
  }
};

/**
 * Resetea la barra de navegación a valores por defecto del sistema
 */
export const resetNavigationBar = async () => {
  if (Platform.OS === 'android') {
    try {
      await NavigationBar.setBackgroundColorAsync('#000000');
      await NavigationBar.setButtonStyleAsync('light');
    } catch (error) {
      console.warn('Error reseteando la barra de navegación:', error);
    }
  }
};
