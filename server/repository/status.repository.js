export const statusRepository = {
  selectDbTime: async (app) => {
    const [rows] = await app.mysql.pool.query("SELECT NOW() AS now");
    return rows;
  }
};