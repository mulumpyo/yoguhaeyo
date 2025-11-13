"use client"; 

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"

const ClientPage = () => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, [count]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">CSR</h2>

      <div className="mt-4 flex flex-col items-start gap-2">
        <p className="text-gray-500">현재 시간: {time}</p>
        <Button onClick={() => setCount(count + 1)}>{count}</Button>
      </div>
    </div>
  );
};

export default ClientPage;
