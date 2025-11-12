import { pool } from "../utils/db.js";

const testRoutes = async (app) => {
  app.get("", {
    schema: {
      tags: ["테스트"],
      summary: "DB 연결 테스트",
      description: "DB 서버의 시간을 응답합니다.",
      response: {
        200: {
          type: "object",
          properties: {
            serverTime: { type: "string" },
          },
        },
      },
    },
  }, async () => {
    const [rows] = await pool.query("SELECT NOW() AS now");
    return { serverTime: rows[0].now };
  });
};

export default testRoutes;
