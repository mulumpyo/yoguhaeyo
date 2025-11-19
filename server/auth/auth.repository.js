export const authRepository = {

  upsertUserAndSelectAssignRole: async (app, githubUser) => {
      const procSql = `
        CALL proc_upsert_user_and_assign_role(?, ?, ?);
      `;
      const procParams = [githubUser.id, githubUser.login, githubUser.avatar_url];
      
      await app.mysql.pool.query(procSql, procParams);
      const user = await authRepository.selectUserByGithubId(app, githubUser.id);
      
      return user;
  },

  selectUserByGithubId: async (app, githubId) => {
    const sql = `
      SELECT
          u.github_id,
          u.username,
          u.avatar,
          r.name AS role_name
      FROM users u
      JOIN user_roles ur ON u.github_id = ur.github_id
      JOIN roles r ON ur.role_id = r.role_id
      WHERE u.github_id = ?
      LIMIT 1
    `;
    const params = [githubId];
    const [rows] = await app.mysql.pool.query(sql, params);
    return rows[0] ?? null;
  },

};