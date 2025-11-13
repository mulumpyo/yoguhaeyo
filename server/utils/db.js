import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// DB 연결
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * DB 연결 상태를 확인
 * @async
 * @function
 * @returns {Promise<boolean>} 정상적으로 작동하면 `true`를 반환, 실패 시 에러 발생
 * @throws {Error} DB 쿼리 실패 시
 */
export const dbConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT 1 AS test");
    console.log("DB connection successful");
    return true;
  } catch (err) {
    console.error("DB connection failed:", err.message);
    throw err;
  }
};