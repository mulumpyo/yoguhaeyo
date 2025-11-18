"use client"

import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";

const GithubLoginButton = ({ variant = "default", text = "GitHub 로그인", cName = "" }) => {
  const handleLogin = () => {
    window.location.href = "/api/auth/github"; 
  };

  return (
    <Button 
      onClick={handleLogin} 
      className={`flex items-center gap-2 cursor-pointer ${cName}`}
      variant={variant}
    >
      <SiGithub className="h-4 w-4" /> 
      {text}
    </Button>
  );
};

export default GithubLoginButton;