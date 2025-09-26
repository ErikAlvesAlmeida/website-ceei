const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const deleteImageFile = (imageUrl) => {
  if (imageUrl) {
    const imagePath = path.join(__dirname, '..', '..', 'public', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.getPostById = async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  
  if (!req.files || !req.files.listCover || !req.files.postCover) {
    return res.status(400).json({ message: 'Ambas as imagens de capa (listCover e postCover) são obrigatórias.' });
  }

  const listCoverUrl = `/uploads/posts/${req.files.listCover[0].filename}`;
  const postCoverUrl = `/uploads/posts/${req.files.postCover[0].filename}`;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content: JSON.parse(content),
        listCoverUrl,
        postCoverUrl,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    deleteImageFile(listCoverUrl);
    deleteImageFile(postCoverUrl);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const dataToUpdate = {};

  try {
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }

    if (title) dataToUpdate.title = title;
    if (content) dataToUpdate.content = JSON.parse(content);

    if (req.files) {
      if (req.files.listCover) {
        deleteImageFile(existingPost.listCoverUrl);
        dataToUpdate.listCoverUrl = `/uploads/posts/${req.files.listCover[0].filename}`;
      }
      if (req.files.postCover) {
        deleteImageFile(existingPost.postCoverUrl); 
        dataToUpdate.postCoverUrl = `/uploads/posts/${req.files.postCover[0].filename}`;
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }
    
    deleteImageFile(post.listCoverUrl);
    deleteImageFile(post.postCoverUrl);
    
    await prisma.post.delete({ where: { id: postId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};