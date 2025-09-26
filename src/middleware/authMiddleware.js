const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.isMaster = (req, res, next) => {
  if (req.user.role !== 'MASTER') {
    return res.status(403).json({ message: 'Acesso negado. Apenas o super usuário pode realizar esta ação.' });
  }
  next();
};