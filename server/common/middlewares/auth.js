export const verifyToken = async (req, reply) => {
  try {

    const token = req.cookies?.access_token;
    if (!token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const decoded = await req.server.jwt.verify(token);
    
    let roles = [];
    if (decoded.role) {
      roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    }

    req.user = {
      githubId: decoded.githubId,
      role: roles,
    };
  } catch (err) {
    return reply.code(401).send({ error: "Invalid token" });
  }
};