import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLogin } from "../../../hook/useLogin";
import "../../../style/login.css";

interface LoginForm
 {
  username: string;
  password: string;
}

interface LoginProps 
{
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) 
{
  const [showPass, setShowPass]=useState<boolean>(false);

  const loginMutation=useLogin({ onLoginSuccess });

  const 
  {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  const onSubmit = (data: LoginForm): void => 
    {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">ورود به حساب</h1>
        <p className="auth-subtitle">اطلاعات خود را وارد کنید</p>

        {loginMutation.isError && (
          <div className="auth-alert">
            {loginMutation.error?.message || "خطا در ورود به سیستم"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={`field-group ${errors.username ? "has-error" : ""}`}>
            <label>نام کاربری</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <img src="/images/envelope.png" alt="envelope" />
              </span>
              <input
                type="text"
                placeholder="نام کاربری را وارد کنید"
                dir="rtl"
                {...register("username", {
                  required: "نام کاربری الزامی است",
                })}
              />
            </div>
            {errors.username && (
              <span className="error-msg">{errors.username.message}</span>
            )}
          </div>

          <div className={`field-group ${errors.password ? "has-error" : ""}`}>
            <label>رمز عبور</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <img src="/images/595586.png" alt="Lock" />
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="رمز عبور را وارد کنید"
                {...register("password", {
                  required: "رمز عبور الزامی است",
                  minLength: {
                    value: 5,
                    message: "رمز عبور حداقل 5 کاراکتر باشد",
                  },
                })}
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
                aria-label="نمایش/مخفی رمز عبور"
              >
                <img
                  src={showPass ? "/images/eyeClose.png" : "/images/eye.png"}
                  alt={showPass ? "مخفی کردن" : "نمایش"}
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
              <span className="spinner" aria-label="در حال ورود..." />
            ) : (
              "ورود"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
