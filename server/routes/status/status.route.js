import { statusController } from "./status.controller.js";
// import { verifyToken } from "../middlewares/auth.js";

// Route 공통
const createRouteOptions = ({ summary, description, response }) => ({
  // preHandler: verifyToken,
  schema: {
    tags: ["상태"],
    summary,
    description,
    response,
  },
});

const statusRoutes = async (app) => {

  // MariaDB
  app.get(
    "/db",
    createRouteOptions({
      summary: "DB 연결 상태",
      description: "DB 서버의 시간을 응답합니다.",
      response: {
        200: {
          type: "object",
          properties: {
            serverTime: { type: "string", example: "2025-11-14T12:34:56Z" },
          },
        },
      },
    }),
    statusController.getDbTime
  );

  // Redis
  app.get(
    "/redis",
    createRouteOptions({
      summary: "Redis 연결 상태",
      description: "Redis PING 응답을 반환합니다.",
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string", example: "PONG" },
          },
        },
      },
    }),
    statusController.getRedisPing
  );

};

export default statusRoutes;