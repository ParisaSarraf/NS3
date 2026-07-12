import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../../../style/login.css";

interface ForgotPasswordForm
{
  phone: string;
}

export default function ForgotPassword() 
{
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: "onBlur",
  });

  const onSubmit = (): void => {
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  if (sent) {
    return (
        <div className="auth-wrapper">
          <div className="auth-card">
            <h1 className="auth-title">SMS Sent</h1>
            <p className="auth-subtitle">A password recovery link was sent to your number</p>
            <Link
                to="/login"
                className="btn-primary"
                style={{ textAlign: "center", textDecoration: "none", display: "block" }}
            >
              Back to Login
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your phone number</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
              <label>Phone Number</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/assets/envelope.png" alt="envelope" />
              </span>
                <input
                    type="tel"
                    placeholder="09123456789"
                    dir="ltr"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^09\d{9}$/,
                        message: "Enter a valid phone number (09XXXXXXXXX)",
                      },
                    })}
                />
              </div>
              {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Send Recovery Link"}
            </button>
          </form>

          <p className="auth-switch">
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
  );
}
