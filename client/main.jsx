import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
      <h1>🚀 React SPA 페이지</h1>
    </div>
  );
};

const container = document.getElementById("root");
createRoot(container).render(<App />);