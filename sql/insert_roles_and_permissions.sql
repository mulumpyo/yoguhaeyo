-- #################################################
-- ## 1. 역할 및 권한 데이터 삽입
-- #################################################

-- 1-1. 전역 권한 (`permissions`)
INSERT INTO `permissions` (`perm_id`, `name`, `description`) VALUES
(1, 'role:manage', '전역 역할 기준 정보 생성/수정/삭제 권한'),
(2, 'permission:manage', '전역 권한 기준 정보 생성/수정/삭제 권한'),
(3, 'user:read_any', '모든 사용자의 계정 정보를 열람할 수 있음'),
(4, 'user:suspend', '사용자 계정을 정지시키거나 복구할 수 있음');

-- 1-2. 전역 역할 (`roles`)
INSERT INTO `roles` (`role_id`, `name`, `description`) VALUES
(1, 'super', '시스템 최고 관리자: 모든 역할 및 권한 관리'),
(2, 'admin', '관리자: 사용자 계정 및 시스템 모니터링'),
(3, 'user', '사용자: 로그인 및 프로젝트 생성 권한');

-- 1-3. 프로젝트 역할 (`project_roles`)
INSERT INTO `project_roles` (`proj_role_id`, `name`, `description`) VALUES
(1, 'owner', '프로젝트 소유자: 프로젝트 삭제 및 설정 변경 권한'),
(2, 'editor', '편집자: 문서 생성 및 수정 권한'),
(3, 'viewer', '열람자: 문서 읽기 권한');

-- 1-4. 프로젝트 권한 (`project_permissions`)
INSERT INTO `project_permissions` (`proj_perm_id`, `name`, `description`) VALUES
(1, 'dev_standard:read', '개발 표준 문서를 열람할 수 있음'),
(2, 'dev_standard:edit', '개발 표준 문서를 수정/갱신할 수 있음'),
(3, 'requirement:read', '요구사항 문서를 열람할 수 있음'),
(4, 'requirement:create', '새 요구사항을 생성할 수 있음'),
(5, 'requirement:edit', '요구사항 문서를 수정/갱신할 수 있음'),
(6, 'requirement:delete', '요구사항 문서를 삭제할 수 있음'),
(7, 'project:manage_members', '프로젝트 팀원을 추가/제거할 수 있음'),
(8, 'project:delete', '프로젝트를 삭제할 수 있음');

-- 1-5. 전역 역할 ↔ 권한 매핑 (`role_permissions`)

-- Super Admin (role_id = 1): 모든 전역 관리 권한 부여 (1~4)
INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4);

-- Admin (role_id = 2): 사용자 조회 권한만 부여 (perm_id=3)
INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(2, 3);

-- User (role_id = 3): 사용자 조회 권한만 부여 (perm_id=3)
INSERT INTO `role_permissions` (`role_id`, `perm_id`) VALUES
(3, 3);

-- 1-6. 프로젝트 역할 ↔ 권한 매핑 (`project_role_permissions`)

-- Owner (proj_role_id = 1): 모든 프로젝트 권한 부여 (1~8)
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


-- #################################################
-- ## 2. 메뉴 데이터 삽입 (type 및 신규 메뉴 반영)
-- #################################################

-- ID 1: 최상위 그룹 메뉴: 홈 (논리적 그룹 헤더, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(1, NULL, '홈', NULL, 'Home', 5, 'GLOBAL');

-- ID 2: 홈 그룹 서브 메뉴: 메인 (parent_id: 1, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(2, 1, '메인', '/app', 'LayoutDashboard', 1, 'GLOBAL');

-- ID 3: 홈 그룹 서브 메뉴: 프로젝트 목록 (parent_id: 1, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(3, 1, '프로젝트 목록', '/app/projects', 'FolderGit2', 2, 'GLOBAL');

-- ID 11: 프로젝트 목록 서브 메뉴: 진행 중인 프로젝트 (parent_id: 3, type: GLOBAL) - 신규 추가
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(11, 3, '진행 중인 프로젝트', '/app/projects/in-progress', 'Clock', 1, 'GLOBAL');

-- ID 12: 프로젝트 목록 서브 메뉴: 종료된 프로젝트 (parent_id: 3, type: GLOBAL) - 신규 추가
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(12, 3, '종료된 프로젝트', '/app/projects/closed', 'Archive', 2, 'GLOBAL');

-- ID 4: 최상위 그룹 메뉴: 관리자 (논리적 그룹 헤더, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(4, NULL, '관리자', NULL, 'Settings', 10, 'GLOBAL');

-- ID 5: 관리자 그룹 서브 메뉴: 사용자 관리 (parent_id: 4, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(5, 4, '사용자 관리', '/app/admin/users', 'Users', 1, 'GLOBAL');

-- ID 6: 관리자 그룹 서브 메뉴: 역할/권한 관리 (parent_id: 4, type: GLOBAL)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(6, 4, '역할/권한 관리', '/app/admin/roles', 'ShieldCheck', 2, 'GLOBAL');

-- ID 7: 프로젝트 그룹 메뉴: 프로젝트 메뉴 (parent_id: NULL, type: PROJECT -> GLOBAL 요청)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(7, NULL, '프로젝트 메뉴', NULL, 'Briefcase', 30, 'GLOBAL');

-- ID 8: 프로젝트 서브 메뉴: 요구사항 문서 (parent_id: 7, type: PROJECT -> GLOBAL 요청)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(8, 7, '요구사항 문서', '/app/project/:id/requirements', 'Clipboard', 1, 'GLOBAL');

-- ID 9: 프로젝트 서브 메뉴: 개발 표준 (parent_id: 7, type: PROJECT -> GLOBAL 요청)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(9, 7, '개발 표준', '/app/project/:id/standards', 'Code', 2, 'GLOBAL');

-- ID 10: 프로젝트 서브 메뉴: 설정 및 멤버 관리 (parent_id: 7, type: PROJECT -> GLOBAL 요청)
INSERT INTO `menus` (`menu_id`, `parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`) VALUES
(10, 7, '설정 및 멤버 관리', '/app/project/:id/settings', 'Settings', 3, 'GLOBAL');


-- #################################################
-- ## 3. 메뉴 ↔ 권한 매핑 데이터 삽입 (신규 메뉴 반영)
-- #################################################

-- Global Permissions (perm_type='GLOBAL', perm_ref_id: permissions.perm_id)

-- user:read_any 권한 (perm_id=3) 필요: 기본 접근 메뉴
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(1, 'GLOBAL', 3), -- 홈 그룹
(2, 'GLOBAL', 3), -- 메인
(3, 'GLOBAL', 3), -- 프로젝트 목록
(4, 'GLOBAL', 3), -- 관리자 그룹
(5, 'GLOBAL', 3), -- 사용자 관리
(11, 'GLOBAL', 3), -- 진행 중인 프로젝트 (신규 추가)
(12, 'GLOBAL', 3); -- 종료된 프로젝트 (신규 추가)

-- role:manage 권한 (perm_id=1) 필요: Super 전용
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(6, 'GLOBAL', 1); -- 역할/권한 관리

-- Project Permissions (proj_perm_id=1, 3, 7이 GLOBAL 권한으로 임시 매핑됨 - 사용자 요청)

-- dev_standard:read 권한 (proj_perm_id=1) 필요
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(7, 'GLOBAL', 1), -- 프로젝트 메뉴 (그룹)
(9, 'GLOBAL', 1); -- 개발 표준

-- requirement:read 권한 (proj_perm_id=3) 필요
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(8, 'GLOBAL', 1); -- 요구사항 문서

-- project:manage_members 권한 (proj_perm_id=7) 필요
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`) VALUES
(10, 'GLOBAL', 1); -- 설정 및 멤버 관리


-- #################################################
-- ## 4. 테스트 사용자 데이터 삽입
-- #################################################

-- 사용자 (`users`)
INSERT INTO `users` (`github_id`, `username`, `avatar`) VALUES
(145254729, 'mulumpyo', 'https://avatars.githubusercontent.com/u/145254729?v=4');

-- 사용자 역할 (`user_roles`): Super 권한 부여
INSERT INTO `user_roles` (`github_id`, `role_id`) VALUES
(145254729, 1);

COMMIT;