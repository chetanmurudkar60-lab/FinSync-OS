import React, {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../services/api";
import { getToken } from "../services/auth";

const DashboardContext =
  createContext();

export const DashboardProvider = ({
  children,
}) => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const refreshDashboard =
    async () => {
      try {
        setLoading(true);

        const token =
          await getToken();

        console.log(
          "Calling Dashboard API..."
        );

        const response =
          await API.get(
            "/dashboard/summary",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        console.log(
          "Dashboard Success:"
        );
        console.log(response.data);

        setDashboard(response.data);
      } catch (error) {
        console.log(
          "Dashboard Error:",
          error.response?.data ||
            error.message
        );

        setDashboard({});
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () =>
  useContext(DashboardContext);