import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import API from "../services/api";
import { getToken } from "../services/auth";

export default function HomeScreen() {
  const { user } = useAuth();
  const { dashboard, loading, refreshDashboard } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  }, [refreshDashboard]);

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              await API.delete(`/expenses/${expenseId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert("Success", "Expense deleted successfully");
              refreshDashboard();
            } catch (error) {
              Alert.alert("Error", "Failed to delete expense");
            }
          },
        },
      ]
    );
  };

  if (loading && !dashboard) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60A5FA" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <View style={styles.avatar}>
            <Icon name="person-circle" size={48} color="#60A5FA" />
          </View>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name?.split(" ")[0] || "User"} 👋</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
          </View>
        </View>
      </View>

      {/* Monthly Budget Card */}
      <View style={styles.budgetCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <Icon name="wallet-outline" size={24} color="#60A5FA" />
        </View>

        <Text style={styles.bigNumber}>₹{dashboard?.totalSpent?.toLocaleString() || 0}</Text>
        <Text style={styles.smallText}>
          of ₹{dashboard?.monthlyBudget?.toLocaleString() || 0}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(dashboard?.usagePercentage || 0, 100)}%` },
            ]}
          />
        </View>

        <Text style={styles.remaining}>
          ₹{dashboard?.remainingBudget?.toLocaleString() || 0} remaining
        </Text>
        <Text style={styles.percentage}>
          {dashboard?.usagePercentage || 0}% of budget used
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="receipt-outline" size={28} color="#60A5FA" />
          <Text style={styles.statNumber}>{dashboard?.expenseCount || 0}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="trending-down-outline" size={28} color="#22C55E" />
          <Text style={styles.statNumber}>₹{dashboard?.totalSpent?.toLocaleString() || 0}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      {/* AI Budget Assistant */}
      <View style={styles.aiCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.aiTitle}>🤖 AI Budget Assistant</Text>
        </View>

        <Text style={styles.aiText}>Top Spending Category</Text>
        <Text style={styles.aiCategory}>{dashboard?.topCategory || "N/A"}</Text>

        <Text style={styles.aiText}>Smart Recommendation</Text>
        <Text style={styles.aiRecommendation}>
          {dashboard?.aiRecommendation || "Keep tracking your expenses daily."}
        </Text>

        {dashboard?.budgetWarning && (
          <View style={styles.warningBox}>
            <Icon name="warning-outline" size={20} color="#FCA5A5" />
            <Text style={styles.warningText}>{dashboard.budgetWarning}</Text>
          </View>
        )}
      </View>

      {/* Recent Expenses */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {dashboard?.recentExpenses?.length > 0 ? (
        dashboard.recentExpenses.map((expense) => (
          <View key={expense._id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <View style={styles.expenseIcon}>
                <Icon name="cart-outline" size={24} color="#94A3B8" />
              </View>
              <View>
                <Text style={styles.expenseTitle}>{expense.description}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
              </View>
            </View>

            <View style={styles.expenseAmountContainer}>
              <Text style={styles.amount}>₹{expense.amount}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteExpense(expense._id)}
              >
                <Icon name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent expenses yet</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 16,
  },
  greeting: {
    color: "#F1F5F9",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
  },

  /* Budget Card */
  budgetCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "600",
  },
  bigNumber: {
    color: "#F1F5F9",
    fontSize: 42,
    fontWeight: "700",
    marginVertical: 8,
  },
  smallText: {
    color: "#64748B",
    fontSize: 16,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 999,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#60A5FA",
    borderRadius: 999,
  },
  remaining: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "600",
  },
  percentage: {
    color: "#60A5FA",
    marginTop: 4,
  },

  /* Stats */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E2937",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  statNumber: {
    color: "#F1F5F9",
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 8,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },

  /* AI Card */
  aiCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  aiTitle: {
    color: "#F1F5F9",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  aiText: {
    color: "#CBD5E1",
    marginBottom: 6,
  },
  aiCategory: {
    color: "#60A5FA",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  aiRecommendation: {
    color: "#E2E8F0",
    lineHeight: 24,
    marginBottom: 16,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#7F1D1D",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  warningText: {
    color: "#FCA5A5",
    fontWeight: "600",
    flex: 1,
  },

  /* Recent Expenses */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: "700",
  },
  seeAll: {
    color: "#60A5FA",
    fontWeight: "600",
  },
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  expenseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#334155",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  expenseTitle: {
    color: "#F1F5F9",
    fontWeight: "600",
    fontSize: 16,
  },
  expenseCategory: {
    color: "#94A3B8",
    fontSize: 14,
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "700",
  },
  deleteButton: {
    marginTop: 8,
    padding: 6,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 16,
  },
});