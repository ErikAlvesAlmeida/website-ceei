// src/controllers/positionController.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();
const titleOrder = ['DIRETOR', 'VICE_DIRETOR', 'COORDENADOR', 'PROFESSOR', 'CORPO_TECNICO'];
const deleteImageFile = (imageUrl) => {
  if (imageUrl && imageUrl !== '/images/default-avatar.png') {
    const imagePath = path.join(__dirname, '..', '..', 'public', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Erro ao deletar a imagem:", err);
      });
    }
  }
};

// GET /api/positions - Listar todos os cargos ORDENADOS
exports.getAllPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany();
    
    positions.sort((a, b) => {
      return titleOrder.indexOf(a.title) - titleOrder.indexOf(b.title);
    });

    res.status(200).json(positions);
  } catch (error) {
    console.error("ERRO DETALHADO em getAllPositions:", error); 
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// CREATE
exports.createPosition = async (req, res) => {
  try {
    const { memberName, title, titleDetail } = req.body;
    let imageUrl = '/images/default-avatar.png';
    if (req.file) {
      imageUrl = `/uploads/positions/${req.file.filename}`;
    }
    const data = {
      memberName,
      title,
      imageUrl,
      titleDetail: title === 'COORDENADOR' ? titleDetail : null,
    };
    const newPosition = await prisma.position.create({ data });
    res.status(201).json(newPosition);
  } catch (error) {
    console.error("ERRO DETALHADO em createPosition:", error);
    if (req.file) deleteImageFile(`/uploads/positions/${req.file.filename}`);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// UPDATE
exports.updatePosition = async (req, res) => {
  try {
    const positionId = parseInt(req.params.id);
    const { memberName, title, titleDetail } = req.body;
    const dataToUpdate = {};
    if (memberName) dataToUpdate.memberName = memberName;
    if (title) {
      dataToUpdate.title = title;
      dataToUpdate.titleDetail = (title === 'COORDENADOR' && titleDetail) ? titleDetail : null;
    }
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) return res.status(404).json({ message: 'Cargo/Membro não encontrado.' });
    if (req.file) {
      dataToUpdate.imageUrl = `/uploads/positions/${req.file.filename}`;
      deleteImageFile(existingPosition.imageUrl);
    }
    const updatedPosition = await prisma.position.update({ where: { id: positionId }, data: dataToUpdate });
    res.status(200).json(updatedPosition);
  } catch (error) {
    console.error("ERRO DETALHADO em updatePosition:", error);
    if (req.file) deleteImageFile(`/uploads/positions/${req.file.filename}`);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// DELETE
exports.deletePosition = async (req, res) => {
  try {
    const positionId = parseInt(req.params.id);
    const position = await prisma.position.findUnique({ where: { id: positionId } });
    if (!position) {
      return res.status(404).json({ message: 'Cargo/Membro não encontrado.' });
    }
    await prisma.position.delete({ where: { id: positionId } });
    deleteImageFile(position.imageUrl);
    res.status(204).send();
  } catch (error) {
    console.error("ERRO DETALHADO em deletePosition:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};