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
import { useAuth } from "../context/AuthContext"; // Volviendo al original

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { login, isLoading } = useAuth();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu email y contraseña");
      return;
    }

    try {
      await login(email, password);
      // La navegación se maneja automáticamente en el layout
    } catch (error: any) {
      Alert.alert(
        "Error de inicio de sesión",
        error.response?.data?.message ||
          "No se pudo iniciar sesión. Por favor intenta nuevamente."
      );
    }
  };
  return (
    <View style={styles.rootContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
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
                <Logo size="large" showText={true} />
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
              </View>{" "}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() =>
                  Alert.alert(
                    "Recuperar contraseña",
                    "Función disponible próximamente"
                  )
                }
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>{" "}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity
                  onPress={() => {
                    // @ts-ignore - Ignoring type check for router.push since expo-router types are problematic
                    router.push("signup");
                  }}
                >
                  <Text style={styles.signupLink}>Regístrate</Text>
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
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
  },
  formContainerNormal: {
    marginTop: 100,
  },
  formContainerKeyboard: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.text,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
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

export default Login;
