import { authService } from "../../auth/auth.service.js";

export const verifyToken = async (req, reply) => {
  try {

    const token = req.cookies?.access_token;
    if (!token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const decoded = await req.server.jwt.verify(token);
    
    const user = await authService.getUserByGithubId(req.server, decoded.githubId);

    if (!user) {
       return reply.code(401).send({ error: "User not found" });
    }

    if (!user.isActive) {
       reply.clearCookie('access_token');
       return reply.code(403).send({ message: "관리자에 의해 정지된 계정입니다." });
    }

    req.user = {
      githubId: user.githubId,
      username: user.username,
      role: user.role || [],
      permissions: user.permissions || []
    };

  } catch (err) {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
};