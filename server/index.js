import path from "path";
import fastify from "fastify";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/db.js";
import middie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import fs from "fs";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 체크
const isProd = process.env.NODE_ENV === "production";

// 서버 포트 설정
const port = 3000;

// 로그 설정
const app = fastify({
  logger: !isProd
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : true,
});

// 서버 생성
const createServer = async () => {
  let viteServer;

  if (!isProd) {

    // 개발 환경

    // Vite
    const vite = await import("vite");
    viteServer = await vite.createServer({
      root: path.resolve(__dirname, "../client"),
      server: { middlewareMode: "ssr" },
      appType: "custom",
    });
    await app.register(middie);
    app.use(viteServer.middlewares);

    // Swagger 등록
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Yoguhaeyo API",
          version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000/api" }],
      },
    });

    // Swagger JSON
    app.get("/openapi.json", async (_, reply) => {
      const swaggerObject = app.swagger();

      const prefixedPaths = {};
      for (const path in swaggerObject.paths) {
        if (path === "/" || path.startsWith("/app") || path === "/openapi.json") continue;

        prefixedPaths[path] = swaggerObject.paths[path];
      }

      swaggerObject.paths = prefixedPaths;

      reply.send(swaggerObject);
    });

    // Scalar UI 등록
    await app.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        spec: { url: "/openapi.json" },
        layout: "modern",
      },
    });
  } else {

    // 배포 환경

    await app.register(fastifyStatic, {
      root: path.join(__dirname, "./public"),
      prefix: "/",
    });
  }

  // SSR 라우트
  app.get("/", async (_, reply) => {
    const { renderMainPage } = await import("./ssr/main.js");
    return reply.type("text/html").send(renderMainPage());
  });

  // SPA 라우트
  app.get("/app", async (_, reply) => {
    if (!isProd) {
      const html = await viteServer.transformIndexHtml(
        "/index.html",
        await fs.promises.readFile(
          path.resolve(__dirname, "../client/index.html"),
          "utf-8"
        )
      );
      return reply.type("text/html").send(html);
    }
    return reply.sendFile("index.html");
  });

  app.get("/app/*", async (_, reply) => {
    if (!isProd) {
      const html = await viteServer.transformIndexHtml(
        "/index.html",
        await fs.promises.readFile(
          path.resolve(__dirname, "../client/index.html"),
          "utf-8"
        )
      );
      return reply.type("text/html").send(html);
    }
    return reply.sendFile("index.html");
  });

  // API 라우트
  await app.register(routes, { prefix: "/api" });

  // DB 연결 테스트
  try {
    await dbConnection();
    app.log.info("DB connection successful");
  } catch (err) {
    app.log.error("DB connection failed:", err.message);
    process.exit(1);
  }

  // 서버 시작
  await app.listen({ port });
  app.log.info(`Server running at http://localhost:${port}`);
};

// 서버 구동
createServer();