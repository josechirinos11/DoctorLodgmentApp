// src/screens/OnboardingScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import AuthSwitcher from '../components/AuthSwitcher';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const { height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');

  return (
    <View style={styles.container}>
      <AuthSwitcher activeForm={activeForm} onSwitch={setActiveForm} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/onboarding1.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/onboarding2.png')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.formContainer}>
          {activeForm === 'login' ? <LoginForm /> : <RegisterForm />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: height * 0.4,
  },
  formContainer: {
    width: '100%',
    padding: 20,
  },
});

export default OnboardingScreen;
