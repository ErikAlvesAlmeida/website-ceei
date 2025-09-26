const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) {
      return res.status(401).json({ message: 'Login ou senha inválidos.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Login ou senha inválidos.' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(200).json({ token, userName: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};