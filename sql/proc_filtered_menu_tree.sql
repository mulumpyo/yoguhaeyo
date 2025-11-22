DROP PROCEDURE IF EXISTS `proc_filtered_menu_tree`;

DELIMITER //

CREATE PROCEDURE `proc_filtered_menu_tree` (
    IN p_github_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_is_super BOOLEAN DEFAULT FALSE;

    -- 0. 안전을 위해 임시 테이블이 남아있다면 먼저 삭제
    DROP TEMPORARY TABLE IF EXISTS UserPerms;

    -- 1. Super Admin 여부 확인
    SELECT COUNT(*) > 0 INTO v_is_super
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.github_id = p_github_id 
      AND r.name = 'super';

    -- 2. 분기 처리
    IF v_is_super THEN
        -- [A] Super Admin이면: 권한 검사 없이 '모든 메뉴' 반환
        SELECT 
            menu_id, parent_id, title, url, icon_name, menu_order
        FROM menus
        ORDER BY menu_order ASC;
        
    ELSE
        -- [B] 일반 사용자면: 권한 필터링 로직 수행
        
        -- 2-1. 사용자 권한 취합을 위한 임시 테이블 생성
        CREATE TEMPORARY TABLE UserPerms (
            perm_type ENUM('GLOBAL', 'PROJECT'),
            perm_ref_id BIGINT UNSIGNED,
            PRIMARY KEY (perm_type, perm_ref_id)
        );

        -- 2-2. GLOBAL 권한 취합 (자신의 역할 -> 권한)
        INSERT INTO UserPerms (perm_type, perm_ref_id)
        SELECT 'GLOBAL', rp.perm_id
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        WHERE ur.github_id = p_github_id;

        -- 2-3. PROJECT 권한 취합
        INSERT INTO UserPerms (perm_type, perm_ref_id)
        SELECT DISTINCT 'PROJECT', prp.proj_perm_id
        FROM project_members pm
        JOIN project_role_permissions prp ON pm.proj_role_id = prp.proj_role_id
        WHERE pm.member_id = p_github_id; 

        -- 2-4. 메뉴 필터링 및 조회
        SELECT DISTINCT
            m.menu_id, m.parent_id, m.title, m.url, m.icon_name, m.menu_order
        FROM menus m
        JOIN menu_permissions mp ON m.menu_id = mp.menu_id
        JOIN UserPerms up ON mp.perm_type = up.perm_type AND mp.perm_ref_id = up.perm_ref_id
        ORDER BY m.menu_order ASC;

        -- 2-5. 임시 테이블 정리
        DROP TEMPORARY TABLE UserPerms;
        
    END IF;

END //

DELIMITER ;