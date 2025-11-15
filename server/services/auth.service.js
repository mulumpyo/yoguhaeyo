// import { authMapper } from "../mappers/auth.mapper.js";

export const authService = {

  /**
   * GitHub OAuth 로그인 처리
   * @param {object} app Fastify 인스턴스
   * @param {object} req Request
   * @param {object} reply Reply
   * @throws {object} {status, message} 오류 발생 시
   */
  loginWithGitHub: async (app, req, reply) => {
    try {
      
      // GitHub Access Token 발급
      const tokenResponse = await app.github.getAccessTokenFromAuthorizationCodeFlow(req);
      const accessToken = tokenResponse?.token?.access_token;
      if (!accessToken) throw { status: 401, message: "Failed to get access token" };

      // GitHub 유저 정보 조회
      const userResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userResponse.ok) throw { status: 502, message: "GitHub API error" };

      const githubUser = await userResponse.json();

      // JWT 발급 및 쿠키 저장
      const jwtToken = app.jwt.sign({
        githubId: githubUser.id,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
      });

      reply.setCookie("access_token", jwtToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1일
      });

    } catch (err) {
      throw err.status ? err : { status: 500, message: "Authentication failed" };
    }
  },

};