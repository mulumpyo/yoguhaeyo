import axios from "axios";

export const logout = async () => {
  try {
    
    await axios.post("/api/auth/logout");

    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  } catch (e) {
    console.error("Logout failed:", e);
  }
};
