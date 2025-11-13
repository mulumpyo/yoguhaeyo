import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Redis 연결
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

/**
 * Redis 연결 상태를 확인
 * @async
 * @function
 * @returns {Promise<boolean>} 정상적으로 작동하면 `true`를 반환, 실패 시 에러 발생
 * @throws {Error} Redis 서버 연결 실패 시
 */
export const redisConnection = async () => {
  try {
    const result = await redis.ping();
    console.log("Redis connection successful");
    return true;
  } catch (err) {
    console.error("Redis connection failed:", err.message);
    throw err;
  }
};
