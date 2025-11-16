export const redisProvider = {
  ping: async (app) => {
    return app.redis.ping();
  }
};