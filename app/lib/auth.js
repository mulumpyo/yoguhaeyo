import axios from "axios";

export const logout = async () => {
  try {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
  } catch (e) {
    console.error("Logout failed or timed out:", e);
  }

  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
};
