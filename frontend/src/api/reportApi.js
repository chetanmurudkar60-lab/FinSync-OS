import API from "../services/api";
import { getToken } from "../services/auth";

export const getMonthlyReport =
  async () => {
    const token =
      await getToken();

    const response =
      await API.get(
        "/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };