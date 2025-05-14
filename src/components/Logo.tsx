import React from 'react';
import { Image, StyleSheet, View, Text, ImageSourcePropType } from 'react-native';
import Colors from '../constants/Colors';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
};

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium',
  showText = true 
}) => {
  // Importar la imagen de manera dinámica
  const logoImage: ImageSourcePropType = require('../../assets/images/logo.jpeg');
  
  // Tamaños del logo según el prop size
  const dimensions = {
    small: 60,
    medium: 100,
    large: 150
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
      
      {showText && (
        <Text style={styles.logoText}>Doctor Lodgment</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  }
});

export default Logo; 