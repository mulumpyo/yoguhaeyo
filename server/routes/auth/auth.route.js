import { authController } from "./auth.controller.js";

// Route 공통
const createRouteOptions = ({ summary, description, response }) => ({
  schema: {
    tags: ["로그인"],
    summary,
    description,
    response,
  },
});

const authRoutes = async (app) => {

  // Github Login Callback
  app.get(
    "/callback",
    createRouteOptions({
      summary: "GitHub OAuth Callback",
      description: "GitHub OAuth Callback 처리 및 사용자 인증",
      response: {
        301: {
          description: "인증 성공시 리다이렉트",
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGc..." },
            user: { type: "object" },
          },
        },
      },
    }),
  authController.githubCallback
  );

};

export default authRoutes;