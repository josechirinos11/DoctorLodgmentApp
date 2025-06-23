import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
};

const Logo: React.FC<LogoProps> = ({ 
  size = 'large',
  showText = true 
}) => {
  // Importar la imagen de manera dinámica
  const logoImage: ImageSourcePropType = require('../../assets/images/logonitido.png');
  
  // Tamaños del contenedor (pequeños para no ocupar espacio)
  const containerDimensions = {
    small: 60,
    medium: 80,
    large: 100  // Contenedor pequeño pero fijo
  };
  
  // Tamaños de la imagen (pueden ser más grandes)
  const imageDimensions = {
    small: 60,
    medium: 100,
    large: 400  // Imagen grande como quieres
  };
  
  const containerSize = containerDimensions[size];
  const imageSize = imageDimensions[size];
  
  return (
    <View style={[
      styles.container,
      { 
        width: containerSize, 
        height: containerSize 
      }
    ]}>
      <Image
        source={logoImage}
        style={[
          styles.logo,
          { 
            width: imageSize, 
            height: imageSize,
            position: 'absolute',  // Imagen no afecta el tamaño del contenedor
            top: -(imageSize - containerSize) / 2,  // Centrar la imagen verticalmente
            left: -(imageSize - containerSize) / 2   // Centrar la imagen horizontalmente
          }
        ]}
        resizeMode="contain"
      />
      
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0, // evita espacio arriba y abajo
    paddingVertical: 0,
    overflow: 'visible',  // Permitir que la imagen se salga del contenedor
    position: 'relative', // Para el posicionamiento absoluto de la imagen
  },
  logo: {
    marginBottom: 0,
  },
});

export default Logo; 