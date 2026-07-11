export function requireAuth(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    return { allowed: true, message: "" };
  }

  window.location.href = "/login";
  return {
    allowed: false,
    message: "لطفا اول وارد شو !",
  };
}

export function requireGuest(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    window.location.href = "/NS3";
    return {
      allowed: false,
      message: "شما قبلاً وارد شده‌اید",
    };
  }

  return { allowed: true, message: "" };
}
