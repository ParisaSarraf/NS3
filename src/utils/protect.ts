export function requireAuth(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    return { allowed: true, message: "" };
  }

  window.location.href = "/login";
  return {
    allowed: false,
    message: "Please log in first!",
  };
}

export function requireGuest(): { allowed: boolean; message: string } {
  const token = localStorage.getItem("access_token");

  if (token) {
    window.location.href = "/NS3";
    return {
      allowed: false,
      message: "You are already logged in",
    };
  }

  return { allowed: true, message: "" };
}
