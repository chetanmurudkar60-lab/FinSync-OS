import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};