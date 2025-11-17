import { authMapper } from "../mappers/auth.mapper.js";
import { githubProvider } from "../providers/github.provider.js";
import { jwtProvider } from "../providers/jwt.provider.js";
import { refreshTokenProvider } from "../providers/refreshToken.provider.js";
import { cookieProvider } from "../providers/cookie.provider.js";

export const authService = {

  /**
   * GitHub OAuth 로그인 처리
   * @throws {object} {status, message} 오류 발생 시
   */
  loginWithGitHub: async (app, req, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    // GitHub 인증
    const accessToken = await githubProvider.getAccessToken(app, req);
    const githubUser = await githubProvider.getUserInfo(accessToken);

    // DB upsert
    await authMapper.upsertUser(app, githubUser);
    const user = (await authMapper.selectUserByGithubId(app, githubUser.id));
    
    if (!user) throw { status: 401, message: "User not found after upsert" };

    // accseeToken 토큰 생성
    const jwtToken = jwtProvider.signAccessToken(app, {
      githubId: Number(githubUser.id),
    });

    // refreshToken 생성
    const refreshToken = refreshTokenProvider.generate();
    await refreshTokenProvider.save(app, refreshToken, githubUser.id);

    // 쿠키 저장
    cookieProvider.setAuthCookies(reply, jwtToken, refreshToken, isProd);
  },

  /**
   * GithubId 값으로 유저 정보 조회
   * @returns {object} { user: { githubId, username, avatar, role }} }
   * @throws {object} {status, message} 오류 발생 시
   */
  getUserByGithubId: async (app, githubId) => {
    return await authMapper.selectUserByGithubId(app, githubId)
  },

  /**
   * refreshToken으로 accessToken 재발급
   * @returns {object} { message: "Token refreshed" }
   * @throws {object} {status, message} 오류 발생 시
   */
  refreshAccessToken: async (app, refreshToken, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    const githubId = await refreshTokenProvider.get(app, refreshToken);
    if (!githubId) throw { status: 401, message: "Invalid refresh token" };

    const user = (await authMapper.selectUserByGithubId(app, githubId));
    if (!user) throw { status: 401, message: "User not found or disabled" };

    const newAccessToken = jwtProvider.signAccessToken(app, {
      githubId: Number(githubId),
    });

    reply.setCookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "Strict" : "Lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return { message: "Token refreshed" };
  },

  /**
   * refreshToken 무효화
   * @throws {object} {status, message} 오류 발생 시
   */
  invalidateRefreshToken: (app, refreshToken) => {
    return refreshTokenProvider.delete(app, refreshToken);
  }

};