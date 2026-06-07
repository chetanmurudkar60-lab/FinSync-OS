import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import API from "../services/api";
import { getToken } from "../services/auth";

export default function FamilyScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [family, setFamily] = useState(null);

  // Form states for create/join
  const [familyName, setFamilyName] = useState("");
  const [familyBudget, setFamilyBudget] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const loadFamily = async () => {
    try {
      const token = await getToken();
      const response = await API.get("/family/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFamily(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setFamily(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFamily();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadFamily();
  }, []);

  const handleCreateFamily = async () => {
    if (!familyName || !familyBudget) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await getToken();
      await API.post(
        "/family/create",
        {
          familyName,
          familyBudget: Number(familyBudget),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Family group created successfully!");
      setFamilyName("");
      setFamilyBudget("");
      loadFamily();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create family");
    }
  };

  const handleJoinFamily = async () => {
    if (!inviteCode) {
      Alert.alert("Error", "Please enter invite code");
      return;
    }

    try {
      const token = await getToken();
      await API.post(
        "/family/join",
        { inviteCode: inviteCode.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Joined family successfully!");
      setInviteCode("");
      loadFamily();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to join family");
    }
  };

  if (loading && !family) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  // No Family State
  if (!family) {
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
          <View style={styles.header}>
            <Text style={styles.heading}>Family Groups</Text>
            <Text style={styles.subHeading}>Share expenses and budgets with loved ones</Text>
          </View>

          {/* Create Family Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="people-circle-outline" size={32} color="#60A5FA" />
              <Text style={styles.cardTitle}>Create New Family</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="home-outline" size={20} color="#94A3B8" />
              <TextInput
                placeholder="Family Name (e.g. The Sharma Family)"
                placeholderTextColor="#64748B"
                value={familyName}
                onChangeText={setFamilyName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="wallet-outline" size={20} color="#94A3B8" />
              <TextInput
                placeholder="Monthly Family Budget"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={familyBudget}
                onChangeText={setFamilyBudget}
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreateFamily}>
              <Text style={styles.buttonText}>Create Family Group</Text>
            </TouchableOpacity>
          </View>

          {/* Join Family Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="enter-outline" size={32} color="#60A5FA" />
              <Text style={styles.cardTitle}>Join Existing Family</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="key-outline" size={20} color="#94A3B8" />
              <TextInput
                placeholder="Enter Invite Code"
                placeholderTextColor="#64748B"
                value={inviteCode}
                onChangeText={setInviteCode}
                style={styles.input}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleJoinFamily}>
              <Text style={styles.buttonText}>Join Family</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Family Dashboard
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60A5FA" />}
    >
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>👨‍👩‍👧‍👦</Text>
        <Text style={styles.heroTitle}>{family.familyName}</Text>
        <Text style={styles.heroSubtitle}>Shared Family Budget</Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  family.familyBudget > 0 ? (family.totalSpent / family.familyBudget) * 100 : 0,
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          ₹{family.totalSpent?.toLocaleString()} of ₹{family.familyBudget?.toLocaleString()}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Icon name="wallet-outline" size={28} color="#60A5FA" />
          <Text style={styles.statNumber}>₹{family.familyBudget?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Budget</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="trending-down-outline" size={28} color="#F87171" />
          <Text style={styles.statNumber}>₹{family.totalSpent?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Icon name="cash-outline" size={28} color="#22C55E" />
          <Text style={styles.statNumber}>₹{family.remainingBudget?.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="people-outline" size={28} color="#60A5FA" />
          <Text style={styles.statNumber}>{family.members?.length || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
      </View>

      {/* Invite Code */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📋 Invite Code</Text>
        </View>
        <Text style={styles.inviteCode}>{family.inviteCode}</Text>
        <Text style={styles.inviteHelper}>Share this code with family members</Text>
      </View>

      {/* Family Members */}
      <Text style={styles.sectionTitle}>Family Members</Text>
      {family.members?.map((member, index) => (
        <View key={index.toString()} style={styles.memberCard}>
          <View style={styles.memberInfo}>
            <Icon name="person-circle-outline" size={40} color="#60A5FA" />
            <View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberEmail}>{member.email}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Family Expenses */}
      <Text style={styles.sectionTitle}>Recent Family Expenses</Text>
      {family.expenses?.length > 0 ? (
        family.expenses.map((expense, index) => (
          <View key={index.toString()} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseDescription}>{expense.description}</Text>
              <Text style={styles.expenseMeta}>
                Added by {expense.userId?.name || "Member"}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No family expenses yet</Text>
        </View>
      )}
    </ScrollView>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
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
    marginTop: 6,
  },

  card: {
    backgroundColor: "#1E2937",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#F1F5F9",
    fontSize: 20,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3B82F6",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  /* Family Dashboard */
  heroCard: {
    backgroundColor: "#1E40AF",
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
  },
  heroEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#DBEAFE",
    marginTop: 6,
    fontSize: 16,
  },
  progressContainer: {
    height: 10,
    backgroundColor: "#1E3A8A",
    borderRadius: 999,
    width: "100%",
    marginVertical: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#60A5FA",
    borderRadius: 999,
  },
  progressText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E2937",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 8,
  },
  statLabel: {
    color: "#94A3B8",
  },

  sectionTitle: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },

  inviteCode: {
    color: "#60A5FA",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 4,
    marginVertical: 12,
  },
  inviteHelper: {
    color: "#94A3B8",
    textAlign: "center",
    fontSize: 14,
  },

  memberCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  memberName: {
    color: "#F1F5F9",
    fontSize: 17,
    fontWeight: "600",
  },
  memberEmail: {
    color: "#94A3B8",
    fontSize: 14,
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  expenseDescription: {
    color: "#F1F5F9",
    fontWeight: "600",
    fontSize: 16,
  },
  expenseMeta: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },
  expenseAmount: {
    color: "#F87171",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 16,
  },
});