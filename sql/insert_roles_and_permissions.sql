-- 역할 및 권한 설정

INSERT INTO `permissions` (`perm_id`, `name`, `description`) VALUES
(1, 'role:manage', '전역 역할 기준 정보 생성/수정/삭제 권한'),
(2, 'permission:manage', '전역 권한 기준 정보 생성/수정/삭제 권한'),
(3, 'user:read_any', '모든 사용자의 계정 정보를 열람할 수 있음'),
(4, 'user:suspend', '사용자 계정을 정지시키거나 복구할 수 있음');

INSERT INTO `roles` (`role_id`, `name`, `description`) VALUES
(1, 'super', '시스템 최고 관리자: 모든 역할 및 권한 관리'),
(2, 'admin', '관리자: 사용자 계정 및 시스템 모니터링'),
(3, 'user', '사용자: 로그인 및 프로젝트 생성 권한');

INSERT INTO `project_roles` (`proj_role_id`, `name`, `description`) VALUES
(1, 'owner', '프로젝트 소유자: 프로젝트 삭제 및 설정 변경 권한'),
(2, 'editor', '편집자: 문서 생성 및 수정 권한'),
(3, 'viewer', '열람자: 문서 읽기 권한');

INSERT INTO `project_permissions` (`proj_perm_id`, `name`, `description`) VALUES
(1, 'dev_standard:read', '개발 표준 문서를 열람할 수 있음'),
(2, 'dev_standard:edit', '개발 표준 문서를 수정/갱신할 수 있음'),
(3, 'requirement:read', '요구사항 문서를 열람할 수 있음'),
(4, 'requirement:create', '새 요구사항을 생성할 수 있음'),
(5, 'requirement:edit', '요구사항 문서를 수정/갱신할 수 있음'),
(6, 'requirement:delete', '요구사항 문서를 삭제할 수 있음'),
(7, 'project:manage_members', '프로젝트 팀원을 추가/제거할 수 있음'),
(8, 'project:delete', '프로젝트를 삭제할 수 있음');

-- role_permissions 테이블 초기 매핑 데이터 삽입

-- Super Admin (role_id = 1): 모든 전역 관리 권한 부여 (1~4)
INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4);

-- 2. Admin (role_id = 2): 사용자 조회 권한만 부여
INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(2, 3);

INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(3, 3);

-- project_role_permissions 테이블 초기 매핑 데이터 삽입

-- Owner (proj_role_id = 1): 모든 권한 부여
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

-- Editor (proj_role_id = 2): 개발/요구사항 읽기, 수정, 생성 권한 부여 (1, 2, 3, 4, 5)
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`) VALUES
(2, 1), -- dev_standard:read
(2, 2), -- dev_standard:edit
(2, 3), -- requirement:read
(2, 4), -- requirement:create
(2, 5); -- requirement:edit

-- Viewer (proj_role_id = 3): 읽기 권한만 부여 (1, 3)
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`) VALUES
(3, 1), -- dev_standard:read
(3, 3); -- requirement:read

-- `menus` 테이블 초기 데이터 삽입

-- 최상위 그룹 메뉴: 시스템 관리 (GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(1, NULL, '시스템 관리', NULL, 'Settings', 10, 'GLOBAL');

-- 서브 메뉴: 사용자 관리 (parent_id: 1)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(2, 1, '사용자 관리', '/app/admin/users', 'Users', 1, 'GLOBAL');

-- 서브 메뉴: 역할/권한 관리 (Super 전용, parent_id: 1)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(3, 1, '역할/권한 관리', '/app/admin/roles', 'Permissions', 2, 'GLOBAL');

-- 최상위 메뉴: 프로젝트 목록 (GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(4, NULL, '프로젝트 목록', '/app/projects', 'Projects', 20, 'GLOBAL');

-- 최상위 메뉴: 대시보드 (GLOBAL - 모든 로그인 사용자)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(5, NULL, '대시보드', '/app/dashboard', 'Home', 5, 'GLOBAL');

-- 프로젝트 내 그룹 메뉴 (PROJECT)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(6, NULL, '프로젝트 메뉴', NULL, 'ProjectIcon', 30, 'PROJECT');

-- 서브 메뉴: 요구사항 문서 (PROJECT, parent_id: 6)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(7, 6, '요구사항 문서', '/app/project/:id/requirements', 'Clipboard', 1, 'PROJECT');

-- 서브 메뉴: 개발 표준 (PROJECT, parent_id: 6)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(8, 6, '개발 표준', '/app/project/:id/standards', 'Code', 2, 'PROJECT');

-- 서브 메뉴: 설정 및 멤버 관리 (Owner 전용, parent_id: 6)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(9, 6, '설정 및 멤버 관리', '/app/project/:id/settings', 'Gear', 3, 'PROJECT');


-- `menu_permissions` 테이블 매핑 데이터 삽입

-- Global Permissions (참조 ID: permissions.perm_id)

-- 5, 4, 1, 2: 'user:read_any' 권한 (perm_id=3) 필요 (Admin/Super/User)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(5, 'GLOBAL', 3), -- 대시보드
(4, 'GLOBAL', 3), -- 프로젝트 목록
(1, 'GLOBAL', 3), -- 시스템 관리 (그룹)
(2, 'GLOBAL', 3); -- 사용자 관리

-- 3: 'role:manage' 권한 (perm_id=1) 필요 (Super 전용)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(3, 'GLOBAL', 1); -- 역할/권한 관리

-- Project Permissions (참조 ID: project_permissions.proj_perm_id)

-- 6: 'dev_standard:read' 권한 (proj_perm_id=1) 필요 (최소 접근 권한)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(6, 'PROJECT', 1); -- 프로젝트 메뉴 (그룹)

-- 8: 'dev_standard:read' 권한 (proj_perm_id=1) 필요 (Viewer, Editor, Owner)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(8, 'PROJECT', 1); -- 개발 표준

-- 7: 'requirement:read' 권한 (proj_perm_id=3) 필요 (Viewer, Editor, Owner)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(7, 'PROJECT', 3); -- 요구사항 문서

-- 9: 'project:manage_members' 권한 (proj_perm_id=7) 필요 (Owner 전용)
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(9, 'PROJECT', 7); -- 설정 및 멤버 관리

-- `users` 테이블에 사용자 데이터 삽입

INSERT INTO `users` (`github_id`, `username`, `avatar`) VALUES
(145254729, 'mulumpyo', 'https://avatars.githubusercontent.com/u/145254729?v=4');

INSERT INTO `user_roles` (`github_id`, `role_id`) VALUES
(145254729, 1);

COMMIT;