import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Ionicons";

import API from "../services/api";
import { getToken } from "../services/auth";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const token = await getToken();
      const response = await API.get("/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading && !analytics) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  const pieData = analytics?.categoryBreakdown?.map((item, index) => ({
    name: item.category,
    population: item.amount,
    color: ["#60A5FA", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"][index % 6],
    legendFontColor: "#E2E8F0",
    legendFontSize: 13,
  })) || [];

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
        <Text style={styles.heading}>Analytics</Text>
        <Text style={styles.subHeading}>Deep insights into your spending</Text>
      </View>

      {/* Financial Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Financial Overview</Text>
          <Icon name="bar-chart-outline" size={24} color="#60A5FA" />
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Budget</Text>
            <Text style={styles.overviewValue}>₹{analytics?.budget?.toLocaleString() || 0}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Spent</Text>
            <Text style={styles.overviewValueSpent}>₹{analytics?.totalSpent?.toLocaleString() || 0}</Text>
          </View>
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={styles.overviewValueRemaining}>₹{analytics?.remaining?.toLocaleString() || 0}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Usage</Text>
            <Text style={styles.overviewValue}>{analytics?.usagePercentage || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Budget Health */}
      <View style={styles.healthCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Budget Health</Text>
        </View>
        <Text style={styles.healthText}>
          {analytics?.usagePercentage < 50
            ? "🟢 Excellent — You're in control"
            : analytics?.usagePercentage < 80
            ? "🟠 Moderate — Keep an eye on spending"
            : "🔴 High Risk — Time to adjust"}
        </Text>
      </View>

      {/* Top Category */}
      {analytics?.topCategory && (
        <View style={styles.topCategoryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Spending Category</Text>
          </View>
          <Text style={styles.topCategory}>{analytics.topCategory.category}</Text>
          <Text style={styles.topAmount}>₹{analytics.topCategory.amount?.toLocaleString()}</Text>
        </View>
      )}

      {/* Category Breakdown Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Spending by Category</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 48}
            height={260}
            chartConfig={{
              backgroundColor: "#1E2937",
              backgroundGradientFrom: "#1E2937",
              backgroundGradientTo: "#1E2937",
              color: (opacity = 1) => `rgba(224, 242, 254, ${opacity})`,
              labelColor: "#E2E8F0",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend
          />
        ) : (
          <Text style={styles.emptyChartText}>No category data available yet</Text>
        )}
      </View>

      {/* AI Insights */}
      <View style={styles.aiCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🤖 AI Insights</Text>
        </View>
        {analytics?.aiInsights?.length > 0 ? (
          analytics.aiInsights.map((insight, index) => (
            <View key={index} style={styles.insightRow}>
              <Icon name="sparkles-outline" size={20} color="#60A5FA" style={styles.insightIcon} />
              <Text style={styles.insight}>{insight}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>AI insights will appear as you add more transactions.</Text>
        )}
      </View>
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
    paddingBottom: 24,
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

  /* Cards */
  overviewCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    color: "#F1F5F9",
    fontSize: 20,
    fontWeight: "700",
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  overviewItem: {
    flex: 1,
  },
  overviewLabel: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 4,
  },
  overviewValue: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: "600",
  },
  overviewValueSpent: {
    color: "#F87171",
    fontSize: 22,
    fontWeight: "600",
  },
  overviewValueRemaining: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "600",
  },

  healthCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  healthText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },

  topCategoryCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  topCategory: {
    color: "#60A5FA",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  topAmount: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "600",
  },

  chartCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  emptyChartText: {
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 40,
  },

  aiCard: {
    backgroundColor: "#1E2937",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  insightRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  insightIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  insight: {
    color: "#E2E8F0",
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
  },
});