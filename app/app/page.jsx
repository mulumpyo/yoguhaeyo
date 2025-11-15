"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

const AppPage = () => {
  const [serverTime, setServerTime] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로그인 상태 확인
        await axios.get("/api/auth/me");

        // DB 상태 확인
        const { data } = await axios.get("/api/status/db");
        setServerTime(data.serverTime);
        setLoading(false);
      } catch (err) {
        router.push("/");
      }
    };

    fetchData();
  }, [count, router]);

  if (loading) {

    return null;
  }

  return (
    <div>
      <h2>CSR 보안 페이지</h2>
      <p>DB 서버 시간: {serverTime}</p>
      <Button onClick={() => setCount(count + 1)}>Refresh ({count})</Button>
    </div>
  );
};

export default AppPage;