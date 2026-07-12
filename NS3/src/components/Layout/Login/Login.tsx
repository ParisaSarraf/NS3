import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLogin } from "../../../hook/useLogin";
import "../../../style/login.css";


interface LoginForm {
  username: string;
  password: string;
}

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [showPass, setShowPass] = useState<boolean>(false);

  const loginMutation = useLogin({ onLoginSuccess });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  const onSubmit = (data: LoginForm): void => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Enter your credentials to continue</p>

        {loginMutation.isError && (
          <div className="auth-alert">
            {loginMutation.error?.message || "Login failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={`field-group ${errors.username ? "has-error" : ""}`}>
            <label>Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <img src="/images/envelope.png" alt="envelope" />
              </span>
              <input
                type="text"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
            </div>
            {errors.username && (
              <span className="error-msg">{errors.username.message}</span>
            )}
          </div>

          <div className={`field-group ${errors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/images/595586.png" alt="Lock" />
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                })}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                <img
                  src={showPass ? "/public/images/eyeClose.png" : "/public/images/eye.png"}
                  alt={showPass ? "Hide" : "Show"}
                />
              </button>
            </div>
            {errors.password && (
              <span className="error-msg">{errors.password.message}</span>
            )}
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="spinner" aria-label="Signing in..." />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
