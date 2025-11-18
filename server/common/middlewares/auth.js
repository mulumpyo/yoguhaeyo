export const verifyToken = async (req, reply) => {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      throw new Error("NO_ACCESS");
    }

    // Access Token 검증
    const decoded = await req.server.jwt.verify(accessToken);

    // access token 정상
    req.user = decoded;

    return;

  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    const isMissing = err.message === "NO_ACCESS";

    // 만료나 없음이 아닌 다른 JWT 오류 401
    if (!isExpired && !isMissing) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    // Refresh Token 검증
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    try {
      const refreshDecoded = await req.server.jwt.verify(refreshToken);

      // 새 Access Token 발급
      const newAccessToken = req.server.jwt.sign(
        { id: refreshDecoded.id },
        { expiresIn: "15m" }
      );

      reply.setCookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      // Refresh Token 만료 임박 시 새로 발급
      const refreshExp = refreshDecoded.exp * 1000;
      const remaining = refreshExp - Date.now();

      const threeDays = 3 * 24 * 60 * 60 * 1000;

      if (remaining < threeDays) {
        const newRefreshToken = req.server.jwt.sign(
          { id: refreshDecoded.id },
          { expiresIn: "30d" }
        );

        reply.setCookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/",
        });
      }

      // 현재 요청도 인증 성공 처리
      req.user = refreshDecoded;

      return;

    } catch (refreshErr) {
      return reply.code(401).send({ error: "Invalid refresh token" });
    }
  }
};
