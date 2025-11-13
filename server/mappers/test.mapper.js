import { pool } from "../utils/db.js";

export const testMapper = {
  async selectDbTime() {
    const [rows] = await pool.query("SELECT NOW() AS now");
    return rows[0].now;
  },
};