DROP PROCEDURE IF EXISTS `proc_upsert_user_and_assign_role`;

DELIMITER //

CREATE PROCEDURE `proc_upsert_user_and_assign_role`(
    IN p_github_id BIGINT UNSIGNED,
    IN p_username VARCHAR(255),
    IN p_avatar VARCHAR(512)
)
BEGIN
    DECLARE v_user_role_id BIGINT UNSIGNED;
    DECLARE v_user_has_roles INT;

    -- 'user' 역할의 role_id를 조회
    SELECT role_id INTO v_user_role_id FROM roles WHERE name = 'user' LIMIT 1;

    -- 트랜잭션 시작
    START TRANSACTION;

    -- 1. users 테이블에 사용자를 추가하거나 업데이트 (UPSERT).
    INSERT INTO users (github_id, username, avatar)
    VALUES (p_github_id, p_username, p_avatar)
    ON DUPLICATE KEY UPDATE
        username = p_username,
        avatar = p_avatar;
        
    -- 2. 해당 사용자에게 할당된 역할이 있는지 확인
    SELECT COUNT(*) INTO v_user_has_roles FROM user_roles WHERE github_id = p_github_id;

    -- 3. 사용자에게 할당된 역할이 없는 경우, 'user' 역할을 부여
    IF v_user_has_roles = 0 AND v_user_role_id IS NOT NULL THEN
        INSERT IGNORE INTO user_roles (github_id, role_id)
        VALUES (p_github_id, v_user_role_id);
    END IF;

    -- 커밋
    COMMIT;

    -- 4. 최종적으로 할당된 사용자 정보와 역할
    SELECT
        u.github_id,
        u.username,
        u.avatar,
        r.name AS role_name
    FROM users u
    LEFT JOIN user_roles ur ON u.github_id = ur.github_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.github_id = p_github_id
    LIMIT 1;

END //

DELIMITER ;