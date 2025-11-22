export const checkGlobalPermission = (requiredPerm) => async (req, reply) => {
  
  const user = req.user || {};
  const userRoles = user.role || [];
  const userPerms = user.permissions || [];

  if (userRoles.includes('super')) {
    return; 
  }

  const hasPermission = userPerms.includes(requiredPerm);

  if (!hasPermission) {
    return reply.code(403).send({ 
      error: "Forbidden", 
      message: `이 작업을 수행하기 위한 권한(${requiredPerm})이 부족합니다.`,
    });
  }

};