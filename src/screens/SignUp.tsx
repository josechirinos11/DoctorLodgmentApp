import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../components/Logo";
import Colors from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { register, isLoading } = useAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleSignUp = async () => {
    // Validar campos
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // Validar formato de email con una expresión regular simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "El email no tiene un formato válido");
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await register({
        email,
        password,
      });
      // La navegación se maneja automáticamente en el layout
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "No se pudo completar el registro. Por favor intenta nuevamente.";
      Alert.alert("Error de registro", errorMessage);
    }
  };
  return (
    <View style={styles.rootContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo favicon en esquina superior derecha cuando teclado está visible */}
          {isKeyboardVisible && (
            <View style={styles.faviconContainer}>
              <Image
                source={require("../../assets/images/logonitido.png")}
                style={styles.faviconImage}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={styles.contentContainer}>
            {/* Logo normal cuando teclado NO está visible */}
            {!isKeyboardVisible && (
              <View style={styles.logoContainer}>
                <Logo size="large" showText={false} />
                <Text style={styles.subtitle}>Únete a Doctor Lodgment</Text>
              </View>
            )}

            <View
              style={[
                styles.formContainer,
                isKeyboardVisible
                  ? styles.formContainerKeyboard
                  : styles.formContainerNormal,
              ]}
            >
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor={Colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={Colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor={Colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Registrarse</Text>
                )}
              </TouchableOpacity>              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginLink}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* View absoluto inferior para cubrir la zona de navegación */}
      <View style={styles.bottomOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 60 : 20,
    paddingBottom: Platform.OS === "android" ? 120 : 40, // Más espacio para evitar que el teclado tape los campos
    minHeight: "100%", // Asegura que el contenido pueda centrarse cuando no hay teclado
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 0,
  },
  faviconContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 50,
    right: 20,
    zIndex: 1000,
  },
  faviconImage: {
    width: 100,
    height: 100,
  },
  subtitle: {
    marginTop: 100,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
  },
  formContainerNormal: {
    marginTop: 10,
  },
  formContainerKeyboard: {
    marginTop: 70,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  passwordToggle: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "android" ? 45 : 0, // Franja más delgada para cubrir zona de navegación
    backgroundColor: "#212121", // Negro para coincidir con la barra de navegación
  },
});

export default SignUp;
