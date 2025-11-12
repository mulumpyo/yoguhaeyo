import { useState, useEffect } from "react";

const AppPage = () => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCount(c => c + 1), 1000);

    const intervalTime = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

    return () => {
      clearInterval(timer);
      clearInterval(intervalTime);
    };
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CSR</h1>
      <p>카운트: {count}</p>
      <p>현재 시간: {time}</p>
      <p>This page is fully client-rendered.</p>
    </div>
  );
};

export default AppPage;