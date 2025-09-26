const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

exports.getAllPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.createPosition = async (req, res) => {
  const { memberName, title } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
  }

  const imageUrl = `/uploads/positions/${req.file.filename}`;

  try {
    const newPosition = await prisma.position.create({
      data: { memberName, title, imageUrl },
    });
    res.status(201).json(newPosition);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.deletePosition = async (req, res) => {
  const positionId = parseInt(req.params.id);

  try {
    const position = await prisma.position.findUnique({ where: { id: positionId } });
    if (!position) {
      return res.status(404).json({ message: 'Cargo/Membro não encontrado.' });
    }

    const imagePath = path.join(__dirname, '..', '..', 'public', position.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await prisma.position.delete({ where: { id: positionId } });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};