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
  
  // Tamaños del logo según el prop size
  const dimensions = {
    small: 60,
    medium: 100,
    large: 400
  };
  
  const logoSize = dimensions[size];
  
  return (
    <View style={styles.container}>
      <Image
        source={logoImage}
        style={[
          styles.logo,
          { width: logoSize, height: logoSize }
        ]}
        resizeMode="contain"
      />
      
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
        marginVertical: 0, // evita espacio arriba y abajo
    paddingVertical: 0,
  },
  logo: {
    marginBottom: 0,
   
  },

});

export default Logo; 