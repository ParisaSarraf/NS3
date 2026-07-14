export function requireAuth(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    return { allowed: true, message: "" };
  }

  window.location.href = "/login";
  return {
    allowed: false,
<<<<<<< HEAD
    message: "لطفا اول وارد شو !",
=======
    message: "Please log in first!",
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  };
}

export function requireGuest(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    window.location.href = "/NS3";
    return {
      allowed: false,
<<<<<<< HEAD
      message: "شما قبلاً وارد شده‌اید",
=======
      message: "You are already logged in",
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    };
  }

  return { allowed: true, message: "" };
}
