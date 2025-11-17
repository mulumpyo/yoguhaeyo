import crypto from "crypto";

export const refreshTokenProvider = {

  generate: () => crypto.randomBytes(64).toString("hex"),

  save: async (app, refreshToken, githubId) => {
    await app.redis.set(
      `refresh:${refreshToken}`,
      githubId,
      "EX",
      60 * 60 * 24 * 30
    );
  },

  get: async (app, refreshToken) => {
    return app.redis.get(`refresh:${refreshToken}`);
  },

  delete: async (app, refreshToken) => {
    return app.redis.del(`refresh:${refreshToken}`);
  }
  
};