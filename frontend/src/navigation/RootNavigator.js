import React from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

import BudgetSetupScreen from "../screens/BudgetSetupScreen";

import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const {
    user,
    token,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <AuthStack />;
  }

  if (
    user &&
    !user.budgetSetupCompleted
  ) {
    return <BudgetSetupScreen />;
  }

  return <MainTabs />;
} 