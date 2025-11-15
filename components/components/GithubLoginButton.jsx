"use client";
import { Button } from "@/components/ui/button";

 const GithubLoginButton = () => {
  const githubLogin = () => {
    const params = new URLSearchParams({
      client_id: "Ov23livRfUIY254mlfvm",
      redirect_uri: "https://yoguhaeyo.mulumpyo.com/api/auth/callback",
      scope: "read:user user:email",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
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