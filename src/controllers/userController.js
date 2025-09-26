const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { cpf } = require('cpf-cnpj-validator');
const prisma = new PrismaClient();

exports.registerUser = async (req, res) => {
  const { name, login, password, birthDate } = req.body;
  if (!cpf.isValid(login)) {
    return res.status(400).json({ message: 'CPF inválido.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário com este CPF já cadastrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        login,
        password: hashedPassword,
        birthDate: new Date(birthDate),
        role: 'ADMIN',
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};