import { testMapper } from "../mappers/test.mapper.js";
import { redis } from "../utils/redis.js";

export const testService = {
  async getDbTime() {
    return await testMapper.selectDbTime();
  },

  async getRedisPing() {
    return await redis.ping();
  },
};  