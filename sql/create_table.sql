-- 테이블 생성

USE `db`;

SET FOREIGN_KEY_CHECKS = 0; -- 외래 키 검사 일시 중지

-- 테이블 삭제
DROP TABLE IF EXISTS `project_role_permissions`;
DROP TABLE IF EXISTS `project_members`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `project_permissions`;
DROP TABLE IF EXISTS `project_roles`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `menus`;
DROP TABLE IF EXISTS `menu_permissions`;

SET FOREIGN_KEY_CHECKS = 1;

-- 사용자 테이블
CREATE TABLE `users` (
	`github_id`	BIGINT UNSIGNED PRIMARY KEY	NOT NULL	COMMENT 'GitHub 계정 고유 식별 번호',
	`username`	VARCHAR(255)	NOT NULL	COMMENT 'GitHub 사용자 이름',
	`avatar`	VARCHAR(512)	NULL	COMMENT 'GitHub 프로필 이미지 URL',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 전역 권한 테이블
CREATE TABLE `permissions` (
	`perm_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`name`	VARCHAR(255) UNIQUE	NOT NULL,
	`description`	VARCHAR(512)	NULL
);

-- 전역 역할 테이블
CREATE TABLE `roles` (
	`role_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`name`	VARCHAR(255) UNIQUE	NOT NULL,
	`description`	VARCHAR(512)	NULL	COMMENT '역할 설명'
);

-- 프로젝트 테이블
CREATE TABLE `projects` (
	`project_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`owner_id`	BIGINT UNSIGNED	NOT NULL	COMMENT 'GitHub 계정 고유 식별 번호 (FK)',
	`name`	VARCHAR(255)	NOT NULL,
	`slug`	VARCHAR(255) UNIQUE	NOT NULL,
	`is_public`	BOOLEAN	NOT NULL	DEFAULT TRUE	COMMENT '외부 공개/비공개 여부',
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 프로젝트 역할 테이블
CREATE TABLE `project_roles` (
	`proj_role_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`name`	VARCHAR(255) UNIQUE	NOT NULL,
	`description`	VARCHAR(512)	NULL
);

-- 프로젝트 권한 테이블
CREATE TABLE `project_permissions` (
	`proj_perm_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`name`	VARCHAR(255) UNIQUE	NOT NULL,
	`description`	VARCHAR(512)	NULL
);

-- 메뉴 테이블
CREATE TABLE `menus` (
	`menu_id`	BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT	NOT NULL,
	`parent_id`	BIGINT UNSIGNED	NULL	COMMENT '상위 메뉴 ID (최상위는 NULL)',
	`title`	VARCHAR(255)	NOT NULL,
	`url`	VARCHAR(512)	NULL	COMMENT '라우팅 경로',
	`icon_name`	VARCHAR(100)	NULL,
	`menu_order`	INT	NOT NULL	DEFAULT 0	COMMENT '동일 레벨 내 표시 순서',
	`type`	ENUM('GLOBAL', 'PROJECT')	NOT NULL	DEFAULT 'GLOBAL'
);

-- 사용자 ↔ 전역 역할 매핑
CREATE TABLE `user_roles` (
	`github_id`	BIGINT UNSIGNED	NOT NULL	COMMENT 'GitHub 계정 고유 식별 번호 (FK)',
	`role_id`	BIGINT UNSIGNED	NOT NULL COMMENT '역할 고유 번호 (FK)',
	PRIMARY KEY (`github_id`, `role_id`)
);

-- 전역 역할 ↔ 권한 매핑
CREATE TABLE `role_permissions` (
	`role_id`	BIGINT UNSIGNED	NOT NULL COMMENT 'roles.role_id 참조 (FK)',
	`perm_id`	BIGINT UNSIGNED	NOT NULL COMMENT 'permissions.perm_id 참조 (FK)',
	PRIMARY KEY (`role_id`, `perm_id`)
);

-- 프로젝트 역할 ↔ 권한 매핑
CREATE TABLE `project_role_permissions` (
	`proj_role_id`	BIGINT UNSIGNED	NOT NULL COMMENT '프로젝트 역할 ID (FK)',
	`proj_perm_id`	BIGINT UNSIGNED	NOT NULL COMMENT '프로젝트 권한 ID (FK)',
	PRIMARY KEY (`proj_role_id`, `proj_perm_id`)
);

-- 프로젝트 ↔ 멤버 ↔ 프로젝트 역할 매핑
CREATE TABLE `project_members` (
	`project_id`	BIGINT UNSIGNED	NOT NULL COMMENT '프로젝트 ID (FK)',
	`member_id`	BIGINT UNSIGNED	NOT NULL	COMMENT 'GitHub 계정 고유 식별 번호 (FK)',
	`proj_role_id`	BIGINT UNSIGNED	NOT NULL COMMENT '프로젝트 역할 ID (FK)',
	PRIMARY KEY (`project_id`, `member_id`)
);

-- 메뉴 ↔ 권한 매핑
CREATE TABLE `menu_permissions` (
	`menu_id`	BIGINT UNSIGNED	NOT NULL,
	`perm_type`	ENUM('GLOBAL', 'PROJECT')	NOT NULL,
	`perm_ref_id`	BIGINT UNSIGNED	NOT NULL	COMMENT 'permissions.perm_id 또는 project_permissions.proj_perm_id',
    PRIMARY KEY (`menu_id`, `perm_type`, `perm_ref_id`)
);

-- 전역 역할 매핑
ALTER TABLE `user_roles` ADD CONSTRAINT `FK_users_TO_user_roles_1` FOREIGN KEY (`github_id`) REFERENCES `users` (`github_id`) ON DELETE CASCADE;
ALTER TABLE `user_roles` ADD CONSTRAINT `FK_roles_TO_user_roles_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;

-- 전역 역할 ↔ 권한 매핑
ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_roles_TO_role_permissions_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_permissions_TO_role_permissions_1` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`perm_id`) ON DELETE CASCADE;

-- 프로젝트 소유자 (projects) 보호
ALTER TABLE `projects` ADD CONSTRAINT `FK_users_TO_projects_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`github_id`) ON DELETE RESTRICT;

-- 프로젝트 역할 ↔ 권한 매핑 (project_role_permissions)
ALTER TABLE `project_role_permissions` ADD CONSTRAINT `FK_project_roles_TO_project_role_permissions_1` FOREIGN KEY (`proj_role_id`) REFERENCES `project_roles` (`proj_role_id`) ON DELETE CASCADE;
ALTER TABLE `project_role_permissions` ADD CONSTRAINT `FK_project_permissions_TO_project_role_permissions_1` FOREIGN KEY (`proj_perm_id`) REFERENCES `project_permissions` (`proj_perm_id`) ON DELETE CASCADE;

-- 프로젝트 멤버십 (project_members)
ALTER TABLE `project_members` ADD CONSTRAINT `FK_projects_TO_project_members_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;
ALTER TABLE `project_members` ADD CONSTRAINT `FK_users_TO_project_members_1` FOREIGN KEY (`member_id`) REFERENCES `users` (`github_id`) ON DELETE CASCADE;
ALTER TABLE `project_members` ADD CONSTRAINT `FK_project_roles_TO_project_members_1` FOREIGN KEY (`proj_role_id`) REFERENCES `project_roles` (`proj_role_id`) ON DELETE RESTRICT;

-- 메뉴 계층 구조 (Self-Reference)
ALTER TABLE `menus` ADD CONSTRAINT `FK_menus_self_reference_1` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`menu_id`) ON DELETE CASCADE;

-- 메뉴 ↔ 권한 매핑
ALTER TABLE `menu_permissions` ADD CONSTRAINT `FK_menus_TO_menu_permissions_1` FOREIGN KEY (`menu_id`)REFERENCES `menus` (`menu_id`) ON DELETE CASCADE;