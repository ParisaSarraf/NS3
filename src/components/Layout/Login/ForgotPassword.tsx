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
            <h1 className="auth-title">پیامک ارسال شد</h1>
            <p className="auth-subtitle">لینک بازیابی رمز به شماره شما ارسال شد</p>
            <Link
                to="/login"
                className="btn-primary"
                style={{ textAlign: "center", textDecoration: "none", display: "block" }}
            >
              بازگشت به ورود
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">فراموشی رمز عبور</h1>
          <p className="auth-subtitle">شماره تلفن خود را وارد کنید</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
              <label>شماره تلفن</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/assets/envelope.png" alt="envelope" />
              </span>
                <input
                    type="tel"
                    placeholder="09123456789"
                    dir="rtl"
                    {...register("phone", {
                      required: "شماره تلفن الزامی است",
                      pattern: {
                        value: /^09\d{9}$/,
                        message: "شماره تلفن معتبر وارد کنید (09XXXXXXXXX)",
                      },
                    })}
                />
              </div>
              {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "ارسال لینک بازیابی"}
            </button>
          </form>

          <p className="auth-switch">
            <Link to="/login">بازگشت به ورود</Link>
          </p>
        </div>
      </div>
  );
}
