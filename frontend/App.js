import { NavigationContainer } from "@react-navigation/native";

import RootNavigator from "./src/navigation/RootNavigator";

import { AuthProvider } from "./src/context/AuthContext";
import {
  DashboardProvider,
} from "./src/context/DashboardContext";

export default function App() {
  return (
    <AuthProvider>
  <DashboardProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </DashboardProvider>
</AuthProvider>
  );
}