"use client";

import { useState } from "react";
import axios from "axios";

const RefreshTest = () => {
  const [status, setStatus] = useState("");

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("/api/auth/refresh", {}, {
        withCredentials: true, // 쿠키 전송
      });
      setStatus(res.data.message);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.error || "Refresh failed");
    }
  };

  return (
    <div>
      <button onClick={refreshAccessToken}>Refresh Access Token</button>
      <p>{status}</p>
    </div>
  );
};

export default RefreshTest;