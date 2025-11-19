DELIMITER //

CREATE PROCEDURE `proc_upsert_user_and_assign_role`(
    IN p_github_id BIGINT UNSIGNED,
    IN p_username VARCHAR(255),
    IN p_avatar VARCHAR(512)
)
BEGIN
    -- 트랜잭션 시작
    START TRANSACTION;

    -- 1. users 테이블에 UPSERT
    INSERT INTO users (github_id, username, avatar)
    VALUES (p_github_id, p_username, p_avatar)
    ON DUPLICATE KEY UPDATE
        username = p_username,
        avatar = p_avatar;
        
    -- 2. 신규 사용자 여부 확인 (ROW_COUNT()가 1이면 신규 )
    IF ROW_COUNT() = 1 THEN 
        -- 3. 신규 사용자일 경우, 기본 역할(role_id=3, user) 할당
        INSERT IGNORE INTO user_roles (github_id, role_id)
        VALUES (p_github_id, 3);
    END IF;

    -- 커밋
    COMMIT;
END //

DELIMITER ;