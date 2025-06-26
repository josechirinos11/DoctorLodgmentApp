import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface NoticiaItem {
  id: number;
  mensaje: string;
}

// Matriz de noticias para producción
const noticiasData: NoticiaItem[] = [
  {
    id: 1,
    mensaje: "🏥 Nuevo sistema de reservas disponible las 24 horas del día"
  },
  {
    id: 2,
    mensaje: "👨‍⚕️ Doctores especializados en todas las áreas médicas"
  },
  {
    id: 3,
    mensaje: "🏠 Hospedajes cómodos y seguros cerca de centros médicos"
  },
  {
    id: 4,
    mensaje: "📱 Gestiona tus citas médicas desde la aplicación"
  },
  {
    id: 5,
    mensaje: "🌟 Calificaciones y reseñas de otros pacientes disponibles"
  },
  {
    id: 6,
    mensaje: "💰 Precios transparentes y opciones de financiamiento"
  },
  {
    id: 7,
    mensaje: "🚗 Transporte incluido desde el aeropuerto al hospedaje"
  },
  {
    id: 8,
    mensaje: "🔒 Tu información médica protegida con máxima seguridad"
  }
];

const Noticiasdiarias: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatedValue] = useState(new Animated.Value(screenWidth));

  useEffect(() => {
    const startAnimation = () => {
      // Reiniciar la posición al inicio
      animatedValue.setValue(screenWidth);
      
      // Animar de derecha a izquierda
      Animated.timing(animatedValue, {
        toValue: -screenWidth,
        duration: 8000, // 8 segundos para cruzar la pantalla
        useNativeDriver: true,
      }).start(() => {
        // Cambiar al siguiente mensaje cuando termine la animación
        setCurrentIndex((prevIndex) => 
          prevIndex === noticiasData.length - 1 ? 0 : prevIndex + 1
        );
      });
    };

    startAnimation();

    // Configurar intervalo para cambiar mensajes
    const interval = setInterval(() => {
      startAnimation();
    }, 8500); // Un poco más que la duración de la animación

    return () => clearInterval(interval);
  }, [animatedValue]); // Removido currentIndex de las dependencias

  const currentNoticia = noticiasData[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.newsBar}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateX: animatedValue }],
            },
          ]}
        >
          <Text style={styles.newsText}>
            {currentNoticia.mensaje}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60, // Altura fija temporal para evitar problemas de layout
    backgroundColor: Colors.neumorphicBase, // Fondo neomórfico
    overflow: 'hidden',
    justifyContent: 'center',
    // Efecto neomórfico hundido (inset)
    shadowColor: Colors.neumorphicDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: -3, // Efecto hundido en Android
    borderWidth: 1,
    borderColor: Colors.neumorphicLight,
    // Efecto de luz interior
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  newsBar: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    // Gradiente simulado con overlay
    backgroundColor: 'rgba(139, 195, 74, 0.15)', // Verde primary con transparencia
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // Efecto de brillo sutil en el contenedor del texto
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 4,
  },
  newsText: {
    color: Colors.neumorphicText, // Texto oscuro contrastante
    fontSize: 16, // Tamaño aumentado para mejor legibilidad
    fontWeight: '700', // Peso de fuente más fuerte
    textAlign: 'center',
    // Efecto de texto remarcado sutil
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Sombra de texto clara
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    // Efecto de borde de texto (simulado con sombras múltiples)
    shadowColor: 'rgba(139, 195, 74, 0.3)', // Sombra verde sutil
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    letterSpacing: 0.5, // Espaciado de letras para mejor legibilidad
    lineHeight: 20, // Altura de línea optimizada
  },
});

export default Noticiasdiarias;
