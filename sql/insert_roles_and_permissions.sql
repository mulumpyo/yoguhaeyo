-- #################################################
-- ## 1. 기초 데이터 정의 (기준 정보)
-- #################################################

-- 1-1. 전역 권한 (Permissions)
INSERT INTO `permissions` (`name`, `description`) VALUES
('role:manage',      '전역 역할 기준 정보 생성/수정/삭제 권한'),
('permission:manage','전역 권한 기준 정보 생성/수정/삭제 권한'),
('user:read_any',    '모든 사용자의 계정 정보를 열람할 수 있음'),
('user:suspend',     '사용자 계정을 정지시키거나 복구할 수 있음'),
('menu:manage',      '사이드바 메뉴 순서, 추가, 삭제 등 메뉴 관련 모든 관리 권한'),
('system:monitor',   'DB 및 Redis 상태 확인 권한');

-- 1-2. 전역 역할 (Roles)
INSERT INTO `roles` (`name`, `priority`, `description`) VALUES
('super', 0, '시스템 최고 관리자: 모든 역할 및 권한 관리'),
('admin', 1, '관리자: 사용자 계정 및 시스템 모니터링'),
('user',  2, '사용자: 로그인 및 프로젝트 생성 권한');

-- 1-3. 프로젝트 역할 (Project Roles)
INSERT INTO `project_roles` (`name`, `description`) VALUES
('owner',  '프로젝트 소유자: 프로젝트 삭제 및 설정 변경 권한'),
('editor', '편집자: 문서 생성 및 수정 권한'),
('viewer', '열람자: 문서 읽기 권한');

-- 1-4. 프로젝트 권한 (Project Permissions)
INSERT INTO `project_permissions` (`name`, `description`) VALUES
('dev_standard:read',      '개발 표준 문서를 열람할 수 있음'),
('dev_standard:edit',      '개발 표준 문서를 수정/갱신할 수 있음'),
('requirement:read',       '요구사항 문서를 열람할 수 있음'),
('requirement:create',     '새 요구사항을 생성할 수 있음'),
('requirement:edit',       '요구사항 문서를 수정/갱신할 수 있음'),
('requirement:delete',     '요구사항 문서를 삭제할 수 있음'),
('project:manage_members', '프로젝트 팀원을 추가/제거할 수 있음'),
('project:delete',         '프로젝트를 삭제할 수 있음');


-- #################################################
-- ## 2. 역할 - 권한 매핑 (가독성 중시)
-- #################################################

-- 2-1. Super Admin에게 부여할 전역 권한들
INSERT INTO `role_permissions` (`role_id`, `perm_id`)
SELECT r.role_id, p.perm_id
FROM `roles` r
JOIN `permissions` p 
  ON r.name = 'super' 
 AND p.name IN (
     'role:manage', 
     'permission:manage', 
     'user:read_any', 
     'user:suspend', 
     'menu:manage',
     'system:monitor'
 );

-- 2-2. Admin에게 부여할 전역 권한들
INSERT INTO `role_permissions` (`role_id`, `perm_id`)
SELECT r.role_id, p.perm_id
FROM `roles` r
JOIN `permissions` p 
  ON r.name = 'admin' 
 AND p.name IN (
     'user:read_any',
     'system:monitor'
 );

-- 2-3. User에게 부여할 전역 권한들
INSERT INTO `role_permissions` (`role_id`, `perm_id`)
SELECT r.role_id, p.perm_id
FROM `roles` r
JOIN `permissions` p 
  ON r.name = 'user' 
 AND p.name IN (
     'user:read_any'
 );


-- #################################################
-- ## 3. 프로젝트 역할 - 권한 매핑
-- #################################################

-- 3-1. Owner (모든 프로젝트 권한)
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`)
SELECT pr.proj_role_id, pp.proj_perm_id
FROM `project_roles` pr
CROSS JOIN `project_permissions` pp -- 모든 권한 부여
WHERE pr.name = 'owner';

-- 3-2. Editor (읽기/쓰기 관련 권한)
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`)
SELECT pr.proj_role_id, pp.proj_perm_id
FROM `project_roles` pr
JOIN `project_permissions` pp
  ON pr.name = 'editor'
 AND pp.name IN (
     'dev_standard:read', 
     'dev_standard:edit',
     'requirement:read', 
     'requirement:create', 
     'requirement:edit'
 );

-- 3-3. Viewer (읽기 권한만)
INSERT INTO `project_role_permissions` (`proj_role_id`, `proj_perm_id`)
SELECT pr.proj_role_id, pp.proj_perm_id
FROM `project_roles` pr
JOIN `project_permissions` pp
  ON pr.name = 'viewer'
 AND pp.name LIKE '%:read'; -- ':read'로 끝나는 모든 권한 자동 부여


-- #################################################
-- ## 4. 메뉴 데이터 삽입 (부모 ID 자동 조회)
-- #################################################

-- 4-1. 최상위(Root) 메뉴 먼저 생성
INSERT INTO `menus` (`title`, `menu_order`, `type`, `icon_name`) VALUES
('홈',       5,  'GLOBAL', 'Home'),
('관리자',   10, 'GLOBAL', 'Settings'),
('프로젝트 메뉴', 30, 'GLOBAL', 'Briefcase');

-- 4-2. [홈] 그룹 하위 메뉴
INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '메인', '/app', 'LayoutDashboard', 1, 'GLOBAL'
FROM `menus` WHERE title = '홈';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '프로젝트 목록', '/app/projects', 'FolderGit2', 2, 'GLOBAL'
FROM `menus` WHERE title = '홈';

-- 4-3. [프로젝트 목록] 메뉴 하위 메뉴 (3 Depth)
-- (부모인 '프로젝트 목록'의 ID를 찾아서 삽입)
INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '진행 중인 프로젝트', '/app/projects/in-progress', 'Clock', 1, 'GLOBAL'
FROM `menus` WHERE title = '프로젝트 목록';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '종료된 프로젝트', '/app/projects/closed', 'Archive', 2, 'GLOBAL'
FROM `menus` WHERE title = '프로젝트 목록';

-- 4-4. [관리자] 그룹 하위 메뉴
INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '사용자 관리', '/app/admin/users', 'Users', 1, 'GLOBAL'
FROM `menus` WHERE title = '관리자';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '역할/권한 관리', '/app/admin/roles', 'ShieldCheck', 2, 'GLOBAL'
FROM `menus` WHERE title = '관리자';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '메뉴 관리', '/app/admin/menu', 'ListTree', 3, 'GLOBAL'
FROM `menus` WHERE title = '관리자';

-- 4-5. [프로젝트 메뉴] 그룹 하위 메뉴
-- (주의: 실제 서비스에선 PROJECT 타입이지만 요청에 따라 GLOBAL 매핑)
INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '요구사항 문서', '/app/project/:id/requirements', 'Clipboard', 1, 'GLOBAL'
FROM `menus` WHERE title = '프로젝트 메뉴';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '개발 표준', '/app/project/:id/standards', 'Code', 2, 'GLOBAL'
FROM `menus` WHERE title = '프로젝트 메뉴';

INSERT INTO `menus` (`parent_id`, `title`, `url`, `icon_name`, `menu_order`, `type`)
SELECT menu_id, '설정 및 멤버 관리', '/app/project/:id/settings', 'Settings', 3, 'GLOBAL'
FROM `menus` WHERE title = '프로젝트 메뉴';


-- #################################################
-- ## 5. 메뉴 - 권한 매핑 (메뉴 이름과 권한 이름을 연결)
-- #################################################

-- 5-1. 기본 조회 권한 ('user:read_any')이 필요한 메뉴들
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`)
SELECT m.menu_id, 'GLOBAL', p.perm_id
FROM `menus` m
JOIN `permissions` p ON p.name = 'user:read_any'
WHERE m.title IN (
    '홈', 
    '메인', 
    '프로젝트 목록', 
    '진행 중인 프로젝트', 
    '종료된 프로젝트', 
    '관리자', 
    '사용자 관리'
);

-- 5-2. 슈퍼 관리자 권한 ('role:manage')이 필요한 메뉴들
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`)
SELECT m.menu_id, 'GLOBAL', p.perm_id
FROM `menus` m
JOIN `permissions` p ON p.name = 'role:manage'
WHERE m.title IN (
    '역할/권한 관리',
    '프로젝트 메뉴', -- (요청사항: 임시로 role:manage 연결)
    '개발 표준',
    '요구사항 문서',
    '설정 및 멤버 관리'
);

-- 5-3. 메뉴 관리 권한 ('menu:manage')이 필요한 메뉴
INSERT INTO `menu_permissions` (`menu_id`, `perm_type`, `perm_ref_id`)
SELECT m.menu_id, 'GLOBAL', p.perm_id
FROM `menus` m
JOIN `permissions` p ON p.name = 'menu:manage'
WHERE m.title = '메뉴 관리';


-- #################################################
-- ## 6. 사용자 및 역할 할당
-- #################################################

-- 6-1. 사용자 생성
INSERT INTO `users` (`github_id`, `username`, `avatar`) VALUES
(145254729, 'mulumpyo', 'https://avatars.githubusercontent.com/u/145254729?v=4');

-- 6-2. 사용자에게 Super Admin 역할 부여
INSERT INTO `user_roles` (`github_id`, `role_id`)
SELECT 145254729, role_id
FROM `roles`
WHERE name = 'super';

COMMIT;