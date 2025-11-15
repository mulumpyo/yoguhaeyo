// import { authMapper } from "../mappers/auth.mapper.js";
import crypto from "crypto";

export const authService = {

  /**
   * GitHub OAuth 로그인 처리
   * @throws {object} {status, message} 오류 발생 시
   */
  loginWithGitHub: async (app, req, reply) => {
    try {

      const isProd = process.env.NODE_ENV === "production";

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

      // JWT 액세스 토큰 발급
      const jwtToken = app.jwt.sign(
        {
          githubId: githubUser.id,
          username: githubUser.login,
          avatar: githubUser.avatar_url,
        },
        { expiresIn: "1h" } // 1시간
      );

      // 리프레시 토큰 생성
      const refreshToken = crypto.randomBytes(64).toString("hex");

      // 리프레시 토큰 Redis 저장
      await app.redis.set(`refresh:${refreshToken}`, githubUser.id, "EX", 60 * 60 * 24 * 30); // 30일

      // 쿠키 저장
      reply
        .setCookie("access_token", jwtToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "Strict" : "Lax",
          path: "/",
          maxAge: 60 * 60,
        })
        .setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "Strict" : "Lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });

    } catch (err) {
      app.log.error(err);
      throw err.status ? err : { status: 500, message: "Authentication failed" };
    }
  },

  /**
   * refreshToken으로 accessToken 재발급
   * @returns {object} { message: "Token refreshed" }
   * @throws {object} {status, message} 오류 발생 시
   */
  refreshAccessToken: async (app, refreshToken, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    try {
      const githubId = await app.redis.get(`refresh:${refreshToken}`);
      if (!githubId) {
        throw { status: 401, message: "Invalid refresh token" };
      }

      // 새로운 Access Token 생성
      const newAccessToken = app.jwt.sign(
        { githubId: Number(githubId) },
        { expiresIn: "1h" }
      );

      reply.setCookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "Strict" : "Lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return { message: "Token refreshed" };

    } catch (err) {
      app.log.error(err);
      throw err.status ? err : { status: 500, message: "Token refresh failed" };
    }
  },

  /**
   * refreshToken 무효화
   * @throws {object} {status, message} 오류 발생 시
   */
  invalidateRefreshToken: async (app, refreshToken) => {
    try {
      await app.redis.del(`refresh:${refreshToken}`);
    } catch (err) {
      app.log.error("Failed to invalidate refresh token:", err);
    }
  },

};