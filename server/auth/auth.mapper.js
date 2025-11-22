import { authRepository } from "./auth.repository.js";

export const authMapper = {

  /**
   * DB의 Raw Row를 애플리케이션/JWT용 User 객체로 변환
   * - snake_case -> camelCase 변환
   * - 콤마로 구분된 문자열(String) -> 배열(Array)로 변환
   * @param {object} userRow DB에서 조회된 원본 데이터
   * @returns {object} 정제된 User 객체
   */
  mapUserFromDbRow: (userRow) => {
    if (!userRow) return null;

    return {
      githubId: userRow.github_id,
      username: userRow.username,
      avatar: userRow.avatar,
      role: userRow.roles_str 
        ? userRow.roles_str.split(',') 
        : [],

      permissions: userRow.perms_str 
        ? userRow.perms_str.split(',') 
        : []
    };
  },

  /**
   * Github ID로 사용자 정보를 조회하고 매핑하여 반환
   * @param {object} app Fastify 인스턴스
   * @param {string|number} githubId
   * @returns {Promise<object>} 매핑된 User 객체 (role, permissions 배열 포함)
   */
  selectUserByGithubId: async (app, githubId) => {
    
    const userRow = await authRepository.selectUserByGithubId(app, githubId);
    
    return authMapper.mapUserFromDbRow(userRow);
  },

};