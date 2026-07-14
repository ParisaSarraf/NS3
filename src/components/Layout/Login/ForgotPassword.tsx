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
<<<<<<< HEAD
            <h1 className="auth-title">پیامک ارسال شد</h1>
            <p className="auth-subtitle">لینک بازیابی رمز به شماره شما ارسال شد</p>
=======
            <h1 className="auth-title">SMS Sent</h1>
            <p className="auth-subtitle">A password recovery link was sent to your number</p>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
            <Link
                to="/login"
                className="btn-primary"
                style={{ textAlign: "center", textDecoration: "none", display: "block" }}
            >
<<<<<<< HEAD
              بازگشت به ورود
=======
              Back to Login
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-wrapper">
        <div className="auth-card">
<<<<<<< HEAD
          <h1 className="auth-title">فراموشی رمز عبور</h1>
          <p className="auth-subtitle">شماره تلفن خود را وارد کنید</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
              <label>شماره تلفن</label>
=======
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your phone number</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
              <label>Phone Number</label>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/assets/envelope.png" alt="envelope" />
              </span>
                <input
                    type="tel"
                    placeholder="09123456789"
<<<<<<< HEAD
                    dir="rtl"
                    {...register("phone", {
                      required: "شماره تلفن الزامی است",
                      pattern: {
                        value: /^09\d{9}$/,
                        message: "شماره تلفن معتبر وارد کنید (09XXXXXXXXX)",
=======
                    dir="ltr"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^09\d{9}$/,
                        message: "Enter a valid phone number (09XXXXXXXXX)",
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
                      },
                    })}
                />
              </div>
              {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
<<<<<<< HEAD
              {loading ? <span className="spinner" /> : "ارسال لینک بازیابی"}
=======
              {loading ? <span className="spinner" /> : "Send Recovery Link"}
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
            </button>
          </form>

          <p className="auth-switch">
<<<<<<< HEAD
            <Link to="/login">بازگشت به ورود</Link>
=======
            <Link to="/login">Back to Login</Link>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
          </p>
        </div>
      </div>
  );
}
