import { statusMapper } from "../mappers/status.mapper.js";
import { formatKST } from "../utils/date.js";

export const statusService = {

  /**
   * DB 서버 시간을 조회
   * @returns {Promise<string>} DB 서버 한국 기준 시간 문자열( format: YYYY-MM-DD HH:mm:SS )
   * @throws {Error} DB 조회 실패 시
   */
  getDbTime: async (app, request, reply) => {
    const rawTime = await statusMapper.selectDbTime(app);
    return formatKST(rawTime);
  },

  /**
   * Redis 서버 상태 확인 (PING)
   * @returns {Promise<string>} Redis 서버가 정상일 경우 "PONG"
   * @throws {Error} Redis 연결 실패 시
   */
  getRedisPing: async (app, request, reply) => {
    return await app.redis.ping();
  },

};