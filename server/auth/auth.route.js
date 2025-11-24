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
      summary: "GitHub Oauth 로그인 콜백",
      description: "GitHub 인증 성공 후 호출되며, 사용자 정보를 저장하고 토큰을 발급합니다.",
      response: {
        302: { description: "로그인 성공 후 메인으로 리다이렉트" },
        400: {
          description: "잘못된 요청 (Authorization Code 누락 등)",
          type: "object",
          properties: { error: { type: "string", example: "Authorization code missing" } }
        },
        401: {
          description: "인증 실패 (사용자 정보 없음)",
          type: "object",
          properties: { error: { type: "string", example: "User not found after upsert" } }
        },
        403: {
          description: "비활성화(정지)된 사용자",
          type: "object",
          properties: { 
            message: { type: "string", example: "관리자에 의해 정지된 계정입니다." },
            error: { type: "string" } 
          }
        },
        500: {
          description: "서버 내부 오류",
          type: "object",
          properties: { error: { type: "string", example: "Authentication failed" } }
        },
      },
    }),
    (request, reply) => authController.githubLoginCallback(app, request, reply)
  );

  // 로그인 상태 확인
  app.get(
    "/me",
    {
      preHandler: verifyToken,
      ...createRouteOptions({
        summary: "로그인 사용자 정보 조회",
        description: "현재 로그인된 사용자의 상세 정보와 권한 목록을 반환합니다.",
        response: {
          200: {
            description: "성공",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  githubId: { type: "number", example: 123456 },
                  username: { type: "string", example: "octocat" },
                  avatar: { type: "string", example: "https://avatars.githubusercontent.com/..." },
                  isActive: { type: "boolean", example: true },
                  
                  role: { 
                    type: "array", 
                    items: { type: "string" },
                    example: ["user", "admin"]
                  },
                  
                  permissions: {
                    type: "array",
                    items: { type: "string" },
                    example: ["user:read", "project:create"]
                  }
                },
              },
            },
          },
          401: {
            description: "토큰이 없거나 유효하지 않음",
            type: "object",
            properties: { error: { type: "string", example: "Unauthorized" } },
          },
          404: {
            description: "사용자를 찾을 수 없음",
            type: "object",
            properties: { error: { type: "string", example: "User not found" } },
          },
        },
      }),
    },
    (request, reply) => authController.getLoginUser(app, request, reply)
  );

  // 토큰 갱신
  app.post(
    "/refresh",
    createRouteOptions({
      summary: "Access Token 재발급",
      description: "HttpOnly 쿠키에 담긴 Refresh Token을 사용하여 Access Token을 재발급합니다.",
      response: {
        200: {
          description: "재발급 성공",
          type: "object",
          properties: {
            message: { type: "string", example: "Token refreshed" },
          },
        },
        401: {
          description: "유효하지 않은 Refresh Token",
          type: "object",
          properties: { error: { type: "string", example: "Invalid refresh token" } },
        },
        403: {
          description: "계정 정지로 인한 재발급 거부",
          type: "object",
          properties: { 
            message: { type: "string", example: "계정이 정지되어 로그아웃됩니다." } 
          }
        },
        404: {
          description: "사용자 정보 없음",
          type: "object",
          properties: { error: { type: "string", example: "User not found" } },
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
      description: "서버의 Refresh Token을 무효화하고 클라이언트 쿠키를 삭제합니다.",
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