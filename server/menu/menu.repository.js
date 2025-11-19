export const menuRepository = {

    /**
     * 저장 프로시저를 호출하여 사용자 권한에 따라 필터링된 메뉴 목록을 불러옴
     * 권한 취합과 메뉴 필터링을 프로시저가 처리
     * @param {number} githubId - 사용자 GitHub ID
     * @returns {Promise<Array<Object>>} 필터링된 메뉴 목록 (플랫 리스트)
     */
    async getFilteredMenusByProcedure(app, githubId) {
        console.log(githubId);
        const procSql = `CALL proc_filtered_menu_tree(?)`;
        
        const [results] = await app.mysql.pool.query(procSql, [githubId]);

        return results[0] || [];
    }
};