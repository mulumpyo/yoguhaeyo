"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ClientPage = () => {
  const [count, setCount] = useState(0);
  const [serverTime, setServerTime] = useState("");

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const { status, data } = await axios.get("/api/status/db");
        if (status === 200) setServerTime(data.serverTime);
      } catch (err) {
        setServerTime("Error");
      }
    };

    fetchServerTime();
  }, [count]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">CSR</h2>

      <div className="mt-4 flex flex-col items-start gap-2">
        <p className="text-gray-700">DB 서버 시간: {serverTime}</p>
        <Button onClick={() => setCount(count + 1)}>{count}</Button>
      </div>
    </div>
  );
};

export default ClientPage;