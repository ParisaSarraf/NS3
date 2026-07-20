import { myAxios } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL_BACKEND || "";

export const getComponents = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Token not found.");
  }

  try {
    const response = await myAxios.get(`${BASE_URL}/components/list-components`, {
      params: {
        access_token: token,
      },
    });

    return response.data;
  } catch (error: any) {
    if (!error.response) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      throw new Error("Server is unavailable.");
    }

    throw error;
  }
};
