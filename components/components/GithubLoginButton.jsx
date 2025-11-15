"use client";
import { Button } from "@/components/ui/button";

const GithubLoginButton = () => {
  const githubLogin = () => {
    window.location.href = "/api/auth/github"; 
  };

  return (
    <Button
      onClick={githubLogin}
      className="px-4 py-2 hover:bg-gray-800"
    >
      GitHub 계정으로 시작하기
    </Button>
  );
};

export default GithubLoginButton;