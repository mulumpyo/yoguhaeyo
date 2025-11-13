import testRoutes from "./test.routes.js";

const routes = async (app, opts) => {
  await app.register(testRoutes, { prefix: "/test" });
};

export default routes;