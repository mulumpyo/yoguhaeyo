import { authRepository } from "./auth.repository.js";

export const authMapper = {

  /**
   * DB에서 조회한 사용자 정보를 기반으로 사용자 객체를 생성
   * @param {object} userRow 
   * @returns 
   */
  mapUserFromDbRow: (userRow) => {
    if (!userRow) return null;

    return {
      githubId: userRow.github_id,
      username: userRow.username,
      avatar: userRow.avatar,
      role: userRow.role_name ?? "user",
    };
  },

  /**
   * 사용자 존재 여부 확인
   * @param {string|number} githubId
   * @returns {Promise<Array>} user 객체 배열
   */
  selectUserByGithubId: async (app, githubId) => {
    const userRow = await authRepository.selectUserByGithubId(app, githubId);
    return authMapper.mapUserFromDbRow(userRow);
  },

};