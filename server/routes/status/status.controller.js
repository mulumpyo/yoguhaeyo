import { statusService } from "../../services/status.service.js";

export const statusController = {
  
  /**
   * DB 서버 시간을 조회
   * @returns {Promise<{ serverTime: string }>} DB 서버 시간 JSON 응답
   */
  async getDbTime(req, reply) {
    try {
      const serverTime = await statusService.getDbTime();
      return reply.send({ serverTime });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },

  /**
   * Redis Ping 상태 조회
   * @returns {Promise<{ status: string }>} 정상적으로 작동시 "Pong" 응답
   */
  async getRedisPing(req, reply) {
    try {
      const status = await statusService.getRedisPing();
      return reply.send({ status });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },
  
};
