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
  }, [currentIndex, animatedValue]);

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
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  newsBar: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },  newsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Noticiasdiarias;
