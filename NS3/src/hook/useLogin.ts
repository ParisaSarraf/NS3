import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UseLoginOptions {
  onLoginSuccess?: () => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,

    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      queryClient.invalidateQueries({ queryKey: ["components"] });

      options?.onLoginSuccess?.();

      navigate("/NS3", { replace: true });
    },

    onError: (error) => 
      {
      console.error("Login Failed:", error.message);
    },
  });
};
