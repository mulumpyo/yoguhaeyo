import statusRoutes from "./status.routes.js";

// API 라우트 등록
const routes = async (app, opts) => {
  await app.register(statusRoutes, { prefix: "/status" });
};

export default routes;