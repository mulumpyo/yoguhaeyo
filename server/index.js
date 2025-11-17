import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import fastify from "fastify";
import fastifyEnv from '@fastify/env';
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import fastifyHelmet from "@fastify/helmet";
import fastifyMysql from "@fastify/mysql";
import fastifyRedis from '@fastify/redis';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyOauth2 from "@fastify/oauth2";
import next from "next";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

const SCALAR_CUSTOM_CSS_PATH = path.join(__dirname, '../server/assets/css/scalar-custom.css');
let customScalarCss = '';

// Log
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

if (!isProd) {
    try {
        customScalarCss = fs.readFileSync(SCALAR_CUSTOM_CSS_PATH, 'utf8');
        app.log.info('Scalar custom CSS loaded successfully.');
    } catch (error) {
        app.log.warn(`Failed to read custom CSS file at ${SCALAR_CUSTOM_CSS_PATH}: ${error.message}`);
    }
}

const createServer = async () => {
  
  // 환경 변수
  await app.register(fastifyEnv, {
    schema: {
      type: 'object',
      required: [
        'BASE_URL',
        'REDIS_HOST',
        'REDIS_PORT',
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'DB_PORT',
        'GITHUB_CLIENT_ID',
        'GITHUB_CLIENT_SECRET',
        'JWT_SECRET',
      ],
      properties: {

        // Base URL
        BASE_URL: { type: 'string' },

        // Redis
        REDIS_HOST: { type: 'string' },
        REDIS_PORT: { type: 'integer' },
        
        // DB
        DB_HOST: { type: 'string' },
        DB_USER: { type: 'string' },
        DB_PASSWORD: { type: 'string' },
        DB_NAME: { type: 'string' },
        DB_PORT: { type: 'integer' },
        
        // Security
        GITHUB_CLIENT_ID: { type: 'string' },
        GITHUB_CLIENT_SECRET: { type: 'string' },
        JWT_SECRET: { type: 'string' },
      },
    },
    dotenv: {
        path: path.join(__dirname, '../.env')
    }
  });

  // 플러그인
  await app.register(fastifyCompress, { global: true });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false, crossOriginResourcePolicy: false });
  await app.register(fastifyCookie);
  await app.register(fastifyOauth2, {
    name: 'github', 
    credentials: { 
      client: {
        id: app.config.GITHUB_CLIENT_ID,
        secret: app.config.GITHUB_CLIENT_SECRET
      },
      auth: {
        authorizeHost: 'https://github.com',
        authorizePath: '/login/oauth/authorize',
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
      },
    },
    startRedirectPath: '/api/auth/github',
    callbackUri: `${app.config.BASE_URL}/api/auth/callback`,
    scope: ['user:email'],
  });

  // JWT
  await app.register(fastifyJwt, { 
    secret: app.config.JWT_SECRET,
    cookie: { 
      cookieName: 'access_token',
      signed: false
    }
  });

  // Next.js
  const nextApp = next({ dev: !isProd, dir: path.join(__dirname, "..") });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  app.all(
    "/*",
    async (req, reply) => {
      try {
        await handle(req.raw, reply.raw);
        reply.hijack();
      } catch (err) {
        app.log.error(err);
        reply.code(500).send("Server Error");
      }
  });

  // Swagger & Scalar
  if (!isProd) {
    await app.register(fastifySwagger, {
      openapi: {
        info: { title: "Yoguhaeyo API", version: "1.0.0" },
        servers: [{ url: "http://localhost:3000/api" }],
      },
    });

    await app.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        layout: "modern",
        showToolbar: "never",
        customCss: customScalarCss,
      },
    });
  }

  // 정적 파일
  if (isProd) {
    await app.register(fastifyStatic, {
      root: path.join(__dirname, "..", ".next"),
      prefix: "/_next/",
      decorateReply: false,
      maxAge: "1d",
    });
  }

  // DB
  await app.register(fastifyMysql, {
    promise: true,
    waitForConnections: true,
    queueLimit: 0,
    connectionLimit: 10,
    host: app.config.DB_HOST,
    port: app.config.DB_PORT,
    user: app.config.DB_USER,
    password: app.config.DB_PASSWORD,
    database: app.config.DB_NAME,
  });

  // Redis
  await app.register(fastifyRedis, {
    host: app.config.REDIS_HOST,
    port: app.config.REDIS_PORT,
  });

  // API
  await app.register(routes, { prefix: "/api" });
  
  // 연결 상태 확인
  app.addHook('onReady', async () => {

    // DB 연결 상태
    try {
      await app.mysql.pool.query("SELECT 1 AS test");
      console.log("DB connection successful");
      app.log.info("DB connection successful");
    } catch (err) {
      console.log("DB connection failed:", err.message);
      app.log.error("DB connection failed:", err.message);
      app.close(); 
      process.exit(1); 
    }

    // Redis 연결 상태
    try {
      await app.redis.ping();
      console.log("Redis connection successful");
      app.log.info("Redis connection successful");
    } catch (err) {
      console.log("Redis connection failed:", err.message);
      app.log.error("Redis connection failed:", err.message);
      app.close();
      process.exit(1);
    }
  });
  
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server listening on port ${port} (${isProd ? "production" : "development"})`);
  app.log.info(`Server listening on port ${port} (${isProd ? "production" : "development"})`);

};

createServer();