import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent } from "react";
import "../../../style/login.css";
import "../../../style/register.css";

interface RegisterForm
 {
  name: string;
  phone: string;
  password: string;
  confirm: string;
}

interface User
 {
  name: string;
  phone: string;
  password: string;
}

export default function Register() 
{
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [strength, setStrength] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    mode: "onChange",
  });

  const password = watch("password", "");
  const confirm = watch("confirm", "");

  const calcStrength = (p: string): void => 
    {
    let s = 0;
    if (p.length >= 6)
    {
      s++;
    }
    if (p.length >= 10)
    {
      s++;
    }
    if (/[A-Z]/.test(p))
    {
      s++;
    }
    if (/[0-9]/.test(p))
    {
      s++;
    }
    if (/[^A-Za-z0-9]/.test(p))
    {
      s++;
    }
    setStrength(s);
  };

  const onSubmit = (data: RegisterForm): void =>
  {
    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const phoneExists = existingUsers.some((u) => u.phone === data.phone);

    if (phoneExists)
    {
      setError("phone",
          {
        type: "manual",
        message: "This phone number is already registered",
      });
      return;
    }

    setLoading(true);
    setTimeout(() =>
    {
      const newUser: User =
          {
        name: data.name,
        phone: data.phone,
        password: data.password,
      };

      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "logged-in");

      navigate("/dashboard");
    }, 800);
  };

  const strengthLabels: string[] = ["", "Very weak", "Weak", "Medium", "Strong", "Very strong"];
  const strengthColors: string[] = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

  return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Enter your information to sign up</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={`field-group ${errors.name ? "has-error" : ""}`}>
              <label>Full Name</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/images/person.png" alt="person" />
              </span>
                <input
                    type="text"
                    placeholder="Full name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                />
              </div>
              {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>

            <div className={`field-group ${errors.phone ? "has-error" : ""}`}>
              <label>Phone Number</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/images/envelope.png" alt="envelope" />
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

            <div className={`field-group ${errors.password ? "has-error" : ""}`}>
              <label>Password</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/images/595586.png" alt="Lock" />
              </span>
                <input
                    type={showPass ? "text" : "password"}
                    placeholder="Strong password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      onChange: (e: ChangeEvent<HTMLInputElement>) => calcStrength(e.target.value),
                    })}
                />
                <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                >
                  <img
                      src={showPass ? "/public/images/eyeClose.png" : "/public/images/eye.png"}
                      alt="toggle"
                  />
                </button>
              </div>
              {password && (
                  <div className="strength-bar">
                    <div className="strength-track">
                      {[1, 2, 3, 4, 5].map((i) => (
                          <div
                              key={i}
                              className="strength-seg"
                              style={{
                                background:
                                    i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)",
                              }}
                          />
                      ))}
                    </div>
                    <span style={{ color: strengthColors[strength], fontSize: "17px" }}>
                  {strengthLabels[strength]}
                </span>
                  </div>
              )}
              {errors.password && <span className="error-msg">{errors.password.message}</span>}
            </div>

            <div className={`field-group ${errors.confirm ? "has-error" : ""}`}>
              <label>Confirm Password</label>
              <div className="input-wrapper">
              <span className="input-icon">
                <img src="/public/images/Key.png" alt="Key" />
              </span>
                <input
                    type="password"
                    placeholder="Repeat password"
                    {...register("confirm", {
                      required: "Password confirmation is required",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                />
                {confirm && (
                    <span style={{ padding: "0 12px", fontSize: "16px" }}>
                  {password === confirm ? "✅" : "❌"}
                </span>
                )}
              </div>
              {errors.confirm && <span className="error-msg">{errors.confirm.message}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
  );
}
