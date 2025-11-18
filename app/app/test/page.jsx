"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

const TestPage = () => {
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await api.get("/api/status/db");
        setTest(data.serverTime);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTest();
  }, []);

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <h1>테스트 중입니다.</h1>
      <p>서버 시간: {test}</p>
    </div>
  );
};

export default TestPage;