import { authMapper } from "../../auth/auth.mapper.js";
import { redisProvider } from "../providers/redis.provider.js";

export const checkGlobalPermission = (requiredPerm) => async (req, reply) => {
  
  const jwtUser = req.user; 
  
  if (!jwtUser || !jwtUser.githubId) {
     return reply.code(401).send({ error: "Unauthorized", message: "로그인 정보가 유효하지 않습니다." });
  }

  let freshUser = await redisProvider.getAuthUser(req.server, jwtUser.githubId);

  if (!freshUser) {
    try {
      freshUser = await authMapper.selectUserByGithubId(req.server, jwtUser.githubId);
      
      if (freshUser) {
        await redisProvider.setAuthUser(req.server, jwtUser.githubId, freshUser);
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  if (!freshUser) {
    return reply.code(401).send({ error: "Unauthorized", message: "존재하지 않는 사용자입니다." });
  }

  if (!freshUser.isActive) {
      return reply.code(403).send({ 
        error: "Forbidden", 
        message: "관리자에 의해 정지된 계정입니다." 
      });
  }

  const userRoles = freshUser.role || [];
  const userPerms = freshUser.permissions || [];

  if (userRoles.includes('super')) {
    req.user = freshUser;
    return; 
  }

  const hasPermission = userPerms.includes(requiredPerm);

  if (!hasPermission) {
    return reply.code(403).send({ 
      error: "Forbidden", 
      message: `이 작업을 수행하기 위한 권한(${requiredPerm})이 부족합니다.`,
    });
  }
  
  req.user = freshUser;
};