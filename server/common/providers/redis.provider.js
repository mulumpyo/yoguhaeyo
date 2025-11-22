export const redisProvider = {
  
  ping: async (app) => {
    return app.redis.ping();
  },

  getAuthUser: async (app, githubId) => {
    try {
      const key = `auth:user:${githubId}`;
      const data = await app.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      app.log.error(`[Redis] getAuthUser Error: ${err.message}`);
      return null;
    }
  },

  setAuthUser: async (app, githubId, user) => {
    try {
      const key = `auth:user:${githubId}`;
      const ttl = 3600; // 1h (초 단위)
      await app.redis.set(key, JSON.stringify(user), 'EX', ttl);
    } catch (err) {
      app.log.error(`[Redis] setAuthUser Error: ${err.message}`);
    }
  },

  delAuthUser: async (app, githubId) => {
    try {
      const key = `auth:user:${githubId}`;
      await app.redis.del(key);
    } catch (err) {
      app.log.error(`[Redis] delAuthUser Error: ${err.message}`);
    }
  }
  
};