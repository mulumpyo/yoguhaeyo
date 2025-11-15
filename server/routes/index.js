import statusRoutes from "./status/status.route.js";
// import authRoutes from "./auth/auth.route.js";

// API 라우트 등록
const routes = async (app, opts) => {
  await app.register(statusRoutes, { prefix: "/status" });
  // await app.register(authRoutes, { prefix: "/auth" });
};

export default routes;