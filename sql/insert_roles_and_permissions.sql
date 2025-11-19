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

COMMIT;