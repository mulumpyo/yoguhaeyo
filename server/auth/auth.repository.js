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
        u.is_active,
        GROUP_CONCAT(DISTINCT r.name) AS roles_str,
        GROUP_CONCAT(DISTINCT p.name) AS perms_str
      FROM users u
      LEFT JOIN user_roles ur ON u.github_id = ur.github_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
      LEFT JOIN permissions p ON rp.perm_id = p.perm_id
      WHERE u.github_id = ?
      GROUP BY u.github_id
      LIMIT 1
    `;

    const [rows] = await app.mysql.pool.query(sql, [githubId]);
    return rows[0] ?? null;
  },

};