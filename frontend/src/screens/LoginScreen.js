import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Install: npm i react-native-vector-icons

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });

      await login(response.data.token, response.data.user);

      Alert.alert("Success", "Welcome back!", [
        { text: "OK", onPress: () => navigation.replace("Main") }, // Replace with your main app navigator
      ]);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Logo / Header */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="wallet" size={60} color="#60A5FA" />
            </View>
            <Text style={styles.title}>Smart Finance</Text>
            <Text style={styles.subtitle}>Track • Budget • Grow</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.signInText}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#64748B"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <Text style={styles.orText}>Or continue with</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="logo-google" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="logo-apple" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.registerLink}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkHighlight}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    backgroundColor: "#1E2937",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#60A5FA",
  },
  title: {
    color: "#F1F5F9",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "#60A5FA",
    fontSize: 16,
    marginTop: 4,
  },
  form: {
    backgroundColor: "#1E2937",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  signInText: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: "#60A5FA",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3B82F6",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  orText: {
    color: "#64748B",
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: "#334155",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  registerLink: {
    alignItems: "center",
  },
  linkText: {
    color: "#94A3B8",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#60A5FA",
    fontWeight: "600",
  },
});