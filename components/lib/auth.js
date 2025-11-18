import axios from "axios";

export const logout = async () => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (e) {
    console.error("Logout failed:", e);
  }

  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
};
