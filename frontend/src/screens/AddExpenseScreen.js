import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import API from "../services/api";
import { getToken } from "../services/auth";
import { useDashboard } from "../context/DashboardContext";

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [expenseType, setExpenseType] = useState("personal");
  const [loading, setLoading] = useState(false);

  const { refreshDashboard } = useDashboard();

  const categories = [
    { name: "Food", icon: "restaurant-outline" },
    { name: "Transport", icon: "car-outline" },
    { name: "Shopping", icon: "bag-handle-outline" },
    { name: "Bills", icon: "document-text-outline" },
    { name: "Entertainment", icon: "game-controller-outline" },
    { name: "Healthcare", icon: "medkit-outline" },
    { name: "Education", icon: "school-outline" },
    { name: "Investment", icon: "trending-up-outline" },
    { name: "Other", icon: "ellipsis-horizontal" },
  ];

  const handleAddExpense = async () => {
    if (!amount || !description) {
      Alert.alert("Validation Error", "Please enter amount and description");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      await API.post(
        "/expenses",
        {
          amount: Number(amount),
          description,
          category,
          expenseType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await refreshDashboard();

      Alert.alert("Success", "Expense added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setAmount("");
            setDescription("");
            setCategory("Other");
            navigation.goBack(); // Return to previous screen
          },
        },
      ]);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add expense"
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Add Expense</Text>
          <Text style={styles.subHeading}>Track your spending instantly</Text>
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <Icon name="cash-outline" size={24} color="#60A5FA" style={styles.inputIcon} />
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputContainer}>
            <Icon name="receipt-outline" size={24} color="#60A5FA" style={styles.inputIcon} />
            <TextInput
              placeholder="What did you spend on? (e.g. Grocery, Petrol)"
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryButton,
                  category === cat.name && styles.activeCategory,
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Icon
                  name={cat.icon}
                  size={20}
                  color={category === cat.name ? "#fff" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.name && styles.activeCategoryText,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expense Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expense Type</Text>
          <View style={styles.typeContainer}>
            {[
              { value: "personal", label: "Personal", icon: "person-outline" },
              { value: "family", label: "Family", icon: "people-outline" },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  expenseType === type.value && styles.activeTypeButton,
                ]}
                onPress={() => setExpenseType(type.value)}
              >
                <Icon
                  name={type.icon}
                  size={22}
                  color={expenseType === type.value ? "#fff" : "#94A3B8"}
                />
                <Text
                  style={[
                    styles.typeText,
                    expenseType === type.value && styles.activeTypeText,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddExpense}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Expense</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  heading: {
    color: "#F1F5F9",
    fontSize: 32,
    fontWeight: "700",
  },
  subHeading: {
    color: "#94A3B8",
    fontSize: 17,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2937",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 17,
  },

  /* Category Chips */
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2937",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
  },
  activeCategory: {
    backgroundColor: "#3B82F6",
  },
  categoryText: {
    color: "#CBD5E1",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* Expense Type */
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E2937",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  activeTypeButton: {
    backgroundColor: "#3B82F6",
  },
  typeText: {
    color: "#CBD5E1",
    fontWeight: "600",
    fontSize: 16,
  },
  activeTypeText: {
    color: "#fff",
  },

  button: {
    backgroundColor: "#3B82F6",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});