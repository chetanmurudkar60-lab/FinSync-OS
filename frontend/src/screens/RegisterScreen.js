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
import Icon from "react-native-vector-icons/Ionicons";

import API from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      Alert.alert(
        "Account Created",
        "Your account has been created successfully!",
        [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong. Please try again."
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
            <Text style={styles.subtitle}>Start your financial journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.signInText}>Join thousands managing smarter</Text>

            <View style={styles.inputContainer}>
              <Icon name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#64748B"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            </View>

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

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.registerLink}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkHighlight}>Sign in</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By registering, you agree to our{" "}
              <Text style={styles.linkHighlight}>Terms</Text> and{" "}
              <Text style={styles.linkHighlight}>Privacy Policy</Text>
            </Text>
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
  registerLink: {
    alignItems: "center",
    marginBottom: 16,
  },
  linkText: {
    color: "#94A3B8",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#60A5FA",
    fontWeight: "600",
  },
  terms: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});