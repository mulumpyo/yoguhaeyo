import statusRoutes from "./status/status.route.js";
import authRoutes from "./auth/auth.route.js";
import menuRoutes from "./menu/menu.route.js";

// API 라우트 등록
const routes = async (app, opts) => {
  await app.register(statusRoutes, { prefix: "/status" });
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(menuRoutes, { prefix: "/menu" });
};

export default routes;