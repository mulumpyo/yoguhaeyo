export const authRepository = {

  upsertUserAndAssignRole: async (app, githubUser) => {
    const procSql = `CALL proc_upsert_user_and_assign_role(?, ?, ?)`;
    const procParams = [githubUser.id, githubUser.login, githubUser.avatar_url];
    
    await app.mysql.pool.query(procSql, procParams);
  },

  selectUserByGithubId: async (app, githubId) => {
    const sql = `
      SELECT
        u.github_id,
        u.username,
        u.avatar,
        r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.github_id = ur.github_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.github_id = ?
      LIMIT 1
    `;
    const params = [githubId];
    const [rows] = await app.mysql.pool.query(sql, params);
    return rows[0] ?? null;
  },

};