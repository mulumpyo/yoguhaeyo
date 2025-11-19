export const menuMapper = {
    /**
     * @description 메뉴 목록 (DB에서 조회된 결과)을 계층적 트리 구조로 변환
     * * @param {Array<Object>} menus - DB에서 조회된 메뉴 목록 (menu_id, parent_id, title 등 포함)
     * @returns {Array<Object>} 계층적 메뉴 트리
     */
    buildMenuTree(menus) {
        const map = {};
        const tree = [];

        menus.forEach(menu => {
            map[menu.menu_id] = { ...menu, items: [] };
        });

        menus.forEach(menu => {
            const item = map[menu.menu_id];
            
            if (item.parent_id) {
                const parent = map[item.parent_id];
                if (parent) {
                    parent.items.push(item);
                }

            } else {
                // parent_id가 없는 최상위 메뉴일 때
                tree.push(item);
            }
        });

        const sortTree = (nodes) => {
            nodes.sort((a, b) => a.menu_order - b.menu_order);
            
            nodes.forEach(node => {
                if (node.items && node.items.length > 0) {
                    sortTree(node.items);
                }
            });
        };

        sortTree(tree);

        return tree;
    }
};