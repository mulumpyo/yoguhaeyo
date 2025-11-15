import { statusService } from "../../services/status.service.js";

export const authController = {

  /**
   * DB 서버 시간을 조회
   * @returns {Promise<{ serverTime: string }>} DB 서버 시간 JSON 응답
   */
  githubCallback: async (req, reply) => {
    try {
      const serverTime = await statusService.getDbTime();
      return reply.send({ serverTime });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  },

};