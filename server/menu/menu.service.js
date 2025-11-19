import { menuRepository } from "./menu.repository.js";
import { menuMapper } from "./menu.mapper.js";

export const menuService = {

    getFilteredMenuTree: async (app, githubId) => {

        const rawMenus = await menuRepository.getFilteredMenusByProcedure(app, githubId);

        if (rawMenus.length === 0) {
            return [];
        }

        return menuMapper.buildMenuTree(rawMenus);
    }

};