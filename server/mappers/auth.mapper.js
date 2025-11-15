export const authMapper = {

  /**
   * 사원 정보 추가 또는 업데이트
   * @description 사용자 정보를 추가하거나 이미 정보가 존재할 경우 업데이트
   */
  upsertUser: async (app, githubUser) => {
    const sql = `
      INSERT INTO users (github_id, username, avatar)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        avatar = VALUES(avatar)
    `;
    const params = [githubUser.id, githubUser.login, githubUser.avatar_url];
    const [result] = await app.mysql.pool.query(sql, params);
    return result;
  },

  /**
   * 사용자 존재 여부 확인
   * @param {string|number} githubId
   * @returns {Promise<Array>} user 객체 배열
   */
  isUser: async (app, githubId) => {
    const sql = `
      SELECT github_id, username, avatar, role
      FROM users
      WHERE github_id = ?
      LIMIT 1
    `;
    const params = [githubId];
    const [result] = await app.mysql.pool.query(sql, params);
    return result;
  },

};