import { authRepository } from "../repository/auth.repository.js";

export const authMapper = {

  /**
   * 사원 정보 추가 또는 업데이트
   * @description 사용자 정보를 추가하거나 이미 정보가 존재할 경우 업데이트
   */
  upsertUser: async (app, githubUser) => {
    return await authRepository.upsertUser(app, githubUser);
  },


  /**
   * 사용자 존재 여부 확인
   * @param {string|number} githubId
   * @returns {Promise<Array>} user 객체 배열
   */
  selectUserByGithubId: async (app, githubId) => {
    const userRow = await authRepository.selectUserByGithubId(app, githubId);

    if (!userRow) return null;

    return {
      githubId: userRow.github_id,
      username: userRow.username,
      avatar: userRow.avatar,
      role: userRow.role ?? "user",
    };
  },

};