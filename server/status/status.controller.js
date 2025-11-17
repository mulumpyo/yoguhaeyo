import { statusService } from "./status.service.js";

export const statusController = {

  /**
   * DB 서버 시간을 조회
   * @returns {Promise<{ serverTime: string }>} DB 서버 시간 응답
   */
  getDbTime: async (app, req, reply) => {
    try {
      const serverTime = await statusService.getDbTime(app);
      return reply.send({ serverTime });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },

  /**
   * Redis Ping 상태 조회
   * @returns {Promise<{ status: string }>} "Pong" 응답
   */
  getRedisPing: async (app, req, reply) => {
    try {
      const status = await statusService.getRedisPing(app);
      return reply.send({ status });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },

};