import { testService } from "../services/test.service.js";

export const testController = {
  async getDbTime(req, reply) {
    try {
      const serverTime = await testService.getDbTime();
      return reply.send({ serverTime });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },

  async getRedisPing(req, reply) {
    try {
      const status = await testService.getRedisPing();
      return reply.send({ status });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },
};
