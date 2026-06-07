import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getToken,
  getUser,
  saveToken,
  saveUser,
  logout as storageLogout,
} from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const storedToken =
        await getToken();

      const storedUser =
        await getUser();

      setToken(storedToken);
      setUser(storedUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    jwtToken,
    userData
  ) => {
    await saveToken(jwtToken);
    await saveUser(userData);

    setToken(jwtToken);
    setUser(userData);
  };

  const updateUser = async (
    updatedUser
  ) => {
    await saveUser(updatedUser);

    setUser(updatedUser);
  };

  const logout = async () => {
    await storageLogout();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);