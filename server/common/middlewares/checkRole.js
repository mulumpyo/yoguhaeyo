export const checkRole = (requiredRoles) => async (req, reply) => {
  const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  const userRoles = req.user?.role || []; 

  const hasPermission = requiredRolesArray.some(requiredRole => 
    userRoles.includes(requiredRole)
  );

  if (!hasPermission) {
    const errorMessage = `접근 권한이 없습니다.`;
      return reply.code(403).send({ 
        error: "Forbidden", 
        message: errorMessage,
    });
  }
};