import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import API from "../services/api";

import { getToken } from "../services/auth";

import { useAuth } from "../context/AuthContext";

export default function BudgetSetupScreen() {
  const [budget, setBudget] = useState("");

  const { user, updateUser } = useAuth();

  const handleSaveBudget = async () => {
    try {
      if (!budget || Number(budget) <= 0) {
        Alert.alert(
          "Invalid Budget",
          "Please enter a valid amount"
        );
        return;
      }

      const token = await getToken();

      const response = await API.put(
        "/users/setup-budget",
        {
          monthlyBudget: Number(budget),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await updateUser({
        ...user,
        monthlyBudget: Number(budget),
        budgetSetupCompleted: true,
      });

      Alert.alert(
        "Success",
        "Budget setup completed successfully"
      );

      console.log(response.data);
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to setup budget"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Setup Your Monthly Budget
      </Text>

      <Text style={styles.subtitle}>
        Enter your monthly spending limit
      </Text>

      <TextInput
        placeholder="Enter Budget (₹)"
        placeholderTextColor="#666"
        keyboardType="numeric"
        style={styles.input}
        value={budget}
        onChangeText={setBudget}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveBudget}
      >
        <Text style={styles.buttonText}>
          Save Budget
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#0F172A",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});