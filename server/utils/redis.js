import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

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
