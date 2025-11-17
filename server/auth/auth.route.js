import { authController } from "./auth.controller.js";
import { verifyToken } from "../common/middlewares/auth.js";

// Route 공통
const createRouteOptions = ({ summary, description, response }) => ({
  schema: {
    tags: ["인증"],
    summary,
    description,
    response,
  },
});

const authRoutes = async (app) => {

  // GitHub Callback
  app.get(
    "/callback",
    createRouteOptions({
      summary: "GitHub Oauth 로그인",
      description: "로그인에 성공할 경우 리다이텍트하는 콜백 함수입니다.",
      response: {
        302: { description: "로그인 성공 후 리다이렉트" },
        400: {
          description: "Authorization Code 누락",
          type: "object",
          properties: { error: { type: "string", example: "Authorization code missing" } }
        },
        401: {
          description: "토큰 발급 실패",
          type: "object",
          properties: { error: { type: "string", example: "User not found after upsert" } }
        },
        500: {
          description: "서버 인증 실패",
          type: "object",
          properties: { error: { type: "string", example: "Authentication failed" } }
        }, 
        502: {
          description: "GitHub API 오류",
          type: "object",
          properties: { error: { type: "string", example: "GitHub API error" } }
        },
      },
    }),
    (request, reply) => authController.githubLoginCallback(app, request, reply)
  );

  // Login 상태
  app.get(
    "/me",
    {
      preHandler: verifyToken,
      ...createRouteOptions({
        summary: "로그인 상태 확인",
        description: "로그인을 한 경우 사용자의 정보를 반환합니다.",
        response: {
          200: {
            description: "로그인 사용자 정보",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  githubId: { type: "number", example: 123456 },
                  username: { type: "string", example: "octocat" },
                  avatar: { type: "string", example: "https://github.com/images/avatar.png" },
                  role: { type: "string", example: "user" }
                },
              },
            },
          },
          401: {
            description: "로그인하지 않은 상태",
            type: "object",
            properties: { error: { type: "string", example: "Unauthorized" } },
          },
          404: {
            description: "사용자를 찾을 수 없음",
            type: "object",
            properties: { error: { type: "string", example: "User not found" } },
          },
          500: {
            description: "서버 오류",
            type: "object",
            properties: { error: { type: "string" , example: "Failed to verify login" } },
          },
        },
      }),
    },
    (request, reply) => authController.getLoginUser(app, request, reply)
  );

  // Refresh Token 사용하여 Access Token 재발급
  app.post(
    "/refresh",
    createRouteOptions({
      summary: "Access Token 재발급",
      description: "Refresh Token을 사용하여 Access Token을 재발급합니다.",
      response: {
        200: {
          description: "Access Token 재발급 완료",
          type: "object",
          properties: {
            message: { type: "string", example: "Token refreshed" },
          },
        },
        401: {
          description: "Refresh Token 유효하지 않음",
          type: "object",
          properties: { error: { type: "string", example: "Invalid refresh token" } },
        },
        404: {
          description: "사용자를 찾을 수 없거나 비활성화됨",
          type: "object",
          properties: { error: { type: "string", example: "Refresh token not found" } },
        },
      },
    }),
    (request, reply) => authController.refreshToken(app, request, reply)
  );

  // 로그아웃
  app.post(
    "/logout",
    createRouteOptions({
      summary: "로그아웃",
      description: "모든 인증 쿠키 삭제 및 Refresh Token 무효화",
      response: {
        200: {
          description: "로그아웃 성공",
          type: "object",
          properties: {
            message: { type: "string", example: "Logged out" },
          },
        },
      },
    }),
    (request, reply) => authController.logout(app, request, reply)
  );

};

export default authRoutes;