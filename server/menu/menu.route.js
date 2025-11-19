import { menuController } from "./menu.controller.js";
import { verifyToken } from "../common/middlewares/auth.js";
import { checkRole } from "../common/middlewares/checkRole.js";

// Route 공통 함수
const createRouteOptions = ({ summary, description, response, roles = ["super"] }) => ({
  preHandler: [verifyToken, checkRole(roles)],
  schema: {
    tags: ["메뉴"],
    summary,
    description,
    response,
    'x-required-roles': roles,
  },
});

const menuRoutes = async (app) => {

  // 사이드바 메뉴 조회
  app.get(
    "/sidebar-menu",
    createRouteOptions({
      summary: "사용자별 사이드바 메뉴 조회",
      description: "사용자의 전역 및 프로젝트 권한에 따라 필터링된 메뉴 목록을 계층 구조로 반환합니다.",
      roles: ["super", "admin", "user"],
      response: {
        200: {
          description: "정상",
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", example: "대시보드" },
              url: { type: "string", example: "/app/dashboard" },
              items: { type: "array" },
            },
          },
        },
        401: {
          description: "로그인 필요",
          type: "object",
          properties: { error: { type: "string", example: "Unauthorized" } },
        },
      },
    }),
    (request, reply) => menuController.getUserMenu(app, request, reply)
  );

};

export default menuRoutes;