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
      description:
        "사용자의 전역 및 프로젝트 권한에 따라 필터링된 메뉴 목록을 계층 구조로 반환합니다.",
      roles: ["super", "admin", "user"],
      response: {
        200: {
          description: "정상",
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              url: { type: "string" },
              items: { type: "array" },
            },
            example: [
              {
                title: "홈",
                url: "",
                items: [
                  {
                    menu_id: 2,
                    title: "메인",
                    url: "/app",
                    icon_name: "LayoutDashboard",
                    items: []
                  },
                  {
                    menu_id: 3,
                    title: "프로젝트 목록",
                    url: "/app/projects",
                    icon_name: "FolderGit2",
                    items: [
                      {
                        menu_id: 11,
                        title: "진행 중",
                        url: "/app/projects/in-progress"
                      },
                      {
                        menu_id: 12,
                        title: "종료",
                        url: "/app/projects/closed"
                      }
                    ]
                  }
                ]
              },
              {
                title: "관리자",
                url: "",
                items: [
                  {
                    menu_id: 5,
                    title: "사용자 관리",
                    url: "/app/admin/users"
                  }
                ]
              }
            ]
          },
        },
        401: {
          description: "로그인 필요",
          type: "object",
          properties: {
            error: { type: "string", example: "Unauthorized" },
          },
        },
      },
    }),
    (request, reply) => menuController.getUserMenu(app, request, reply)
  );

};

export default menuRoutes;