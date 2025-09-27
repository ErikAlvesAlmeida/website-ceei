const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.createPartner = async (req, res) => {
  const { name, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
  }
  if (description && description.length > 256) {
    return res.status(400).json({ message: 'A descrição não pode ter mais de 100 caracteres.' });
  }

  const imageUrl = `/uploads/partners/${req.file.filename}`;

  try {
    const newPartner = await prisma.partner.create({
      data: { name, description, imageUrl },
    });
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.deletePartner = async (req, res) => {
  const partnerId = parseInt(req.params.id);

  try {
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ message: 'Parceiro não encontrado.' });
    }

    const imagePath = path.join(__dirname, '..', '..', 'public', partner.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await prisma.partner.delete({ where: { id: partnerId } });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};