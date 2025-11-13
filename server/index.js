import path from "path";
import { fileURLToPath } from "url";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import fastifyHelmet from "@fastify/helmet";
import next from "next";
import { dbConnection } from "./utils/db.js";
import { redisConnection } from "./utils/redis.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

const app = fastify({
  logger: !isProd
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
        },
      }
    : { level: "warn" },
});

const createServer = async () => {

  // 공통 플러그인
  await app.register(fastifyCompress, { global: true });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false, crossOriginResourcePolicy: false });

  // Swagger & Scalar
  if (!isProd) {
    await app.register(fastifySwagger, {
      openapi: {
        info: { title: "Yoguhaeyo API", version: "1.0.0" },
        servers: [{ url: "http://localhost:3000/api" }],
      },
    });

    // openapi.json
    app.get("/openapi.json", async (_, reply) => {
      const swaggerObject = app.swagger();

      const cleanPaths = {};
      for (const [key, val] of Object.entries(swaggerObject.paths)) {
        if (key === "/openapi.json" || key.startsWith("/{")) continue;
        cleanPaths[key] = val;
      }
      swaggerObject.paths = cleanPaths;

      reply.header("Content-Type", "application/json; charset=utf-8");
      reply.send(swaggerObject);
    });

    await app.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        spec: { url: "/openapi.json" },
        layout: "modern",
      },
    });
  }

  // Next.js 설정
  const nextApp = next({ dev: !isProd, dir: path.join(__dirname, "..") });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  if (isProd) {
    await app.register(fastifyStatic, {
      root: path.join(__dirname, "..", ".next"),
      prefix: "/_next/",
      decorateReply: false,
      maxAge: "1d",
    });
  }

  app.all("/*", async (req, reply) => {
    try {
      await handle(req.raw, reply.raw);
      reply.hijack();
    } catch (err) {
      app.log.error(err);
      reply.code(500).send("Server Error");
    }
  });

  // API
  await app.register(routes, { prefix: "/api" });

  // DB 연결
  try {
    await dbConnection();
    app.log.info("DB connection successful");
  } catch (err) {
    app.log.error("DB connection failed:", err.message);
    process.exit(1);
  }

  // Redis 연결
  try {
    await redisConnection();
    app.log.info("Redis connection successful");
  } catch (err) {
    app.log.error("Redis connection failed:", err.message);
    process.exit(1);
  }
  
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server listening on port ${port} (${isProd ? "production" : "development"})`);
  app.log.info(`Server listening on port ${port} (${isProd ? "production" : "development"})`);
};

createServer();