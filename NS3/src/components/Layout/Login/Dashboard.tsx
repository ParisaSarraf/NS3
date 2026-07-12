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
          Log Out
        </button>

        <div className="dashboard-card">
          <div className="welcome-section">
            <div className="avatar">👤</div>
            <h1>Hello, {user.name || "User"}!</h1>
            <p>Welcome to the dashboard</p>
          </div>

          <div className="info-section">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value" dir="ltr">
              {user.phone}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}
