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
<<<<<<< HEAD
          خروج
=======
          Log Out
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
        </button>

        <div className="dashboard-card">
          <div className="welcome-section">
            <div className="avatar">👤</div>
<<<<<<< HEAD
            <h1>سلام، {user.name || "کاربر"}!</h1>
            <p>به داشبورد خوش آمدید</p>
=======
            <h1>Hello, {user.name || "User"}!</h1>
            <p>Welcome to the dashboard</p>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
          </div>

          <div className="info-section">
            <div className="info-item">
<<<<<<< HEAD
              <span className="info-label">نام:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">شماره تماس:</span>
=======
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
              <span className="info-value" dir="ltr">
              {user.phone}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}
