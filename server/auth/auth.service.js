import { authMapper } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import { githubProvider } from "../common/providers/github.provider.js";
import { jwtProvider } from "../common/providers/jwt.provider.js";
import { refreshTokenProvider } from "../common/providers/refreshToken.provider.js";
import { cookieProvider } from "../common/providers/cookie.provider.js";
import { redisProvider } from "../common/providers/redis.provider.js";

export const authService = {

  /**
   * GitHub OAuth 로그인 처리
   * @throws {object} {status, message} 오류 발생 시
   */
  loginWithGitHub: async (app, req, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    // 1. GitHub 인증
    const accessToken = await githubProvider.getAccessToken(app, req);
    const githubUser = await githubProvider.getUserInfo(accessToken);

    // 2. DB Upsert (사용자 정보 저장/업데이트)
    await authRepository.upsertUserAndAssignRole(app, githubUser);
    
    // 3. 최신 사용자 정보 조회
    const user = await authMapper.selectUserByGithubId(app, githubUser.id);
    if (!user) throw { status: 401, message: "User not found after upsert" };

    if (!user.isActive) {
      throw { status: 403, message: "비활성화된 계정입니다." };
    }

    // 4. [Cache Warm-up] 로그인 직후 Redis에 최신 정보 캐싱
    await redisProvider.setAuthUser(app, githubUser.id, user);

    // 5. AccessToken 생성
    const jwtToken = jwtProvider.signAccessToken(app, {
      githubId: Number(githubUser.id),
    });

    // 6. RefreshToken 생성 및 저장
    const refreshToken = refreshTokenProvider.generate();
    await refreshTokenProvider.save(app, refreshToken, githubUser.id);

    // 7. 쿠키 설정
    cookieProvider.setAuthCookies(reply, jwtToken, refreshToken, isProd);
  },

  /**
   * GithubId 값으로 유저 정보 조회
   * (서비스 내부 호출용 or /me API용)
   * @returns {object} user 객체
   */
  getUserByGithubId: async (app, githubId) => {
    // 1. Redis 먼저 확인
    let user = await redisProvider.getAuthUser(app, githubId);
    
    // 2. 없으면 DB 확인
    if (!user) {
        user = await authMapper.selectUserByGithubId(app, githubId);
        if (user) {
            await redisProvider.setAuthUser(app, githubId, user);
        }
    }
    
    return user;
  },

  /**
   * refreshToken으로 accessToken 재발급
   * @returns {object} { message: "Token refreshed" }
   */
  refreshAccessToken: async (app, refreshToken, reply) => {
    const isProd = process.env.NODE_ENV === "production";

    // 1. Refresh Token 검증
    const githubId = await refreshTokenProvider.get(app, refreshToken);
    if (!githubId) throw { status: 401, message: "Invalid refresh token" };

    // 2. 유저 유효성 재확인 (DB 조회)
    const user = await authMapper.selectUserByGithubId(app, githubId);
    if (!user) throw { status: 404, message: "User not found or disabled" };

    if (!user.isActive) {
      await refreshTokenProvider.delete(app, refreshToken);
      await redisProvider.delAuthUser(app, githubId);
      throw { status: 403, message: "계정이 비활성화되었습니다." };
    }

    // 3. 재발급 시점의 최신 권한을 Redis에 업데이트
    await redisProvider.setAuthUser(app, githubId, user);

    // 4. 새 AccessToken 발급
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
   * refreshToken 무효화 (로그아웃)
   */
  invalidateRefreshToken: async (app, refreshToken) => {
    
    const githubId = await refreshTokenProvider.get(app, refreshToken);
    if (githubId) {
        await redisProvider.delAuthUser(app, githubId);
    }
    return refreshTokenProvider.delete(app, refreshToken);
  }

};