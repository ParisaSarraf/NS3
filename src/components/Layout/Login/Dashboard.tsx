import { useNavigate } from "react-router-dom";
import "../../../style/dashboard.css";

interface User 
{
  name: string;
  phone: string;
  password: string;
}

export default function Dashboard() 
{
  const navigate = useNavigate();
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = (): void => 
    {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
      <div className="dashboard-wrapper">
        <button className="logout-btn" onClick={handleLogout}>
          خروج
        </button>

        <div className="dashboard-card">
          <div className="welcome-section">
            <div className="avatar">👤</div>
            <h1>سلام، {user.name || "کاربر"}!</h1>
            <p>به داشبورد خوش آمدید</p>
          </div>

          <div className="info-section">
            <div className="info-item">
              <span className="info-label">نام:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">شماره تماس:</span>
              <span className="info-value" dir="ltr">
              {user.phone}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}
