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

exports.deleteUser = async (req, res) => {
  const idToDelete = parseInt(req.params.id);

  if (idToDelete === 1) {
    return res.status(403).json({ message: 'A conta do super usuário não pode ser excluída.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: idToDelete },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await prisma.user.delete({
      where: { id: idToDelete },
    });

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  const { name, password } = req.body;

  const dataToUpdate = {};

  if (name) {
    dataToUpdate.name = name;
  }

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ message: 'Nenhum dado para atualizar foi fornecido (nome ou senha).' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);

  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

exports.cleanupAdminUsers = async (req, res) => {
  try {
    const deleteResult = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'MASTER',
        },
      },
    });

    res.status(200).json({
      message: 'Operação de limpeza concluída com sucesso.',
      deletedCount: deleteResult.count,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, name: true, login: true, createdAt: true },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};