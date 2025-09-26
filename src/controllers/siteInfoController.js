const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSiteInfo = async (req, res) => {
  try {
    const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } });
    if (!siteInfo) {
      return res.status(404).json({ message: 'Informações do site não encontradas.' });
    }
    res.status(200).json(siteInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.updateSiteInfo = async (req, res) => {
  const { aboutText, contactPhone1, contactPhone2, contactEmail } = req.body;
  const dataToUpdate = {};

  if (aboutText && aboutText.trim() !== '') {
    dataToUpdate.aboutText = aboutText.trim();
  }

  if (contactPhone1) dataToUpdate.contactPhone1 = contactPhone1;
  if (contactPhone2) dataToUpdate.contactPhone2 = contactPhone2;
  if (contactEmail) dataToUpdate.contactEmail = contactEmail;

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ message: 'Nenhum dado válido para atualizar foi fornecido.' });
  }

  try {
    const updatedSiteInfo = await prisma.siteInfo.update({
      where: { id: 1 },
      data: dataToUpdate,
    });
    res.status(200).json(updatedSiteInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};