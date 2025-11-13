import jwt from "jsonwebtoken";

export const verifyToken = async (req, reply) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
};