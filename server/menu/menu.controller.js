import { menuService } from './menu.service.js';

export const menuController = {

  /**
   * @description 사용자 권한에 따라 필터링된 사이드바 메뉴를 계층 구조로 조회
   * @returns {Promise<Array<Object>>} 계층적 메뉴 트리
   */
  getUserMenu: async (app, req, reply) => {
    const githubId = req.user.githubId;

    try {
      const menuTree = await menuService.getFilteredMenuTree(app, githubId);
      
      return reply.send(menuTree);

    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "Internal Server Error", message: "메뉴 로딩 중 오류가 발생했습니다." });
    }
  },

};