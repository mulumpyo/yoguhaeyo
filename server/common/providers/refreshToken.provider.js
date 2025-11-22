import crypto from "crypto";

export const refreshTokenProvider = {

  generate: () => crypto.randomBytes(64).toString("hex"),

  hash: (token) =>
    crypto.createHash("sha512").update(token).digest("hex"),

  save: async (app, refreshToken, githubId) => {
    const hashed = refreshTokenProvider.hash(refreshToken);
    await app.redis.set(
      `refresh:${hashed}`,
      githubId,
      "EX",
      60 * 60 * 24 * 30
    );
  },

  get: async (app, refreshToken) => {
    const hashed = refreshTokenProvider.hash(refreshToken);
    return app.redis.get(`refresh:${hashed}`);
  },

  delete: async (app, refreshToken) => {
    const hashed = refreshTokenProvider.hash(refreshToken);
    return app.redis.del(`refresh:${hashed}`);
  }
};