export const authRepository = {

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

  selectUserByGithubId: async (app, githubId) => {
    const sql = `
      SELECT github_id, username, avatar, role
      FROM users
      WHERE github_id = ?
      LIMIT 1
    `;
    const params = [githubId];
    const [rows] = await app.mysql.pool.query(sql, params);
    return rows[0] ?? null;
  },

};