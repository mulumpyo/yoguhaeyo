DROP PROCEDURE IF EXISTS `proc_filtered_menu_tree`;

DELIMITER //

CREATE PROCEDURE `proc_filtered_menu_tree` (
    IN p_github_id BIGINT UNSIGNED
)
BEGIN
    -- 1. 사용자 권한을 임시 테이블에 취합
    CREATE TEMPORARY TABLE IF NOT EXISTS UserPerms (
        perm_type ENUM('GLOBAL', 'PROJECT'),
        perm_ref_id BIGINT UNSIGNED,
        PRIMARY KEY (perm_type, perm_ref_id)
    );
    
    -- 기존의 UNION 쿼리 결과를 임시 테이블에 삽입
    INSERT INTO UserPerms (perm_type, perm_ref_id)
    SELECT 'GLOBAL', T4.perm_id
    FROM user_roles AS T2
    JOIN role_permissions AS T3 ON T2.role_id = T3.role_id
    JOIN permissions AS T4 ON T3.perm_id = T4.perm_id
    WHERE T2.github_id = p_github_id
    
    UNION
    
    SELECT 'PROJECT', T4.proj_perm_id
    FROM project_members AS T2
    JOIN project_role_permissions AS T3 ON T2.proj_role_id = T3.proj_role_id
    JOIN project_permissions AS T4 ON T3.proj_perm_id = T4.proj_perm_id
    WHERE T2.member_id = p_github_id;

    -- 2. 임시 테이블을 사용하여 메뉴 필터링
    SELECT DISTINCT
        T1.menu_id, T1.parent_id, T1.title, T1.url, T1.icon_name, T1.menu_order
    FROM menus AS T1
    JOIN menu_permissions AS T2 ON T1.menu_id = T2.menu_id
    JOIN UserPerms AS UP ON T2.perm_type = UP.perm_type AND T2.perm_ref_id = UP.perm_ref_id
    ORDER BY T1.menu_order ASC;
    
    -- 임시 테이블 정리
    DROP TEMPORARY TABLE IF EXISTS UserPerms;
    
END //

DELIMITER ;