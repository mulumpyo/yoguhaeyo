import { pool } from "../utils/db.js";

export const statusMapper = {

  /**
   * DB 서버 현재 시간을 조회
   * @returns {Promise<string>} DB 서버 현재 시간 문자열 (예: "2025-11-13T14:01:59.000Z")
   * @throws {Error} DB 쿼리 실패 시
   */
  async selectDbTime() {
    const [rows] = await pool.query("SELECT NOW() AS now");
    return rows[0].now;
  },
  
};