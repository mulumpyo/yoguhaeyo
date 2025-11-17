import { authService } from "./auth.service.js";

export const authController = {

  /**
   * GitHub Oauth 로그인
   * @description 로그인 성공시 HTTP 상태 코드 302
   */
  githubLoginCallback: async (app, req, reply) => {
    try {
      const { code } = req.query;
      if (!code) {
        return reply.code(400).send({ error: "Authorization code missing" });
      }

      await authService.loginWithGitHub(app, req, reply);

      reply.type("text/html");
      return reply.send(`
        <script>
          window.location.href = "/app";
        </script>
      `);

    } catch (err) {
      app.log.error(err);
      return reply.code(err.status || 500).send({
        error: err.message || "Authentication failed"
      });
    }
  },

  /**
   * 로그인 상태 확인
   * @description 로그인한 사용자일 경우 사용자의 정보를 반환
   */
  getLoginUser: async (app, req, reply) => {
    try {
      const githubId = req.user.githubId;
      const user = await authService.getUserByGithubId(app, githubId);

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return reply.send({ user });
    } catch (err) {
      return reply.code(500).send({ error: "Failed to verify login" });
    }
  },

  /**
   * Access Token 재발급
   * @description RefreshToken을 사용하여 Access Token을 재발급하여 반환
   */
  refreshToken: async (app, req, reply) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return reply.code(401).send({ error: "Refresh token not found" });
      }

      const result = await authService.refreshAccessToken(app, refreshToken, reply);
      return reply.send(result);

    } catch (err) {
      app.log.error(err);
      return reply.code(err.status || 500).send({ error: err.message });
    }
  },

  /**
   * 로그아웃
   * @description Refresh Token 삭제 및 쿠키 제거
   */
  logout: async (app, req, reply) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        await authService.invalidateRefreshToken(app, refreshToken);
      }

      reply
        .clearCookie("access_token", { path: "/" })
        .clearCookie("refresh_token", { path: "/" });

      return reply.send({ message: "Logged out" });

    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "Logout failed" });
    }
  },

};