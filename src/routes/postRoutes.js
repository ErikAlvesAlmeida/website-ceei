const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');
const { postUpload } = require('../middleware/uploadMiddleware');

const postImageUpload = postUpload.fields([
  { name: 'listCover', maxCount: 1 },
  { name: 'postCover', maxCount: 1 }
]);

// Rotas Públicas
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Rotas Protegidas 
router.post('/', verifyToken, postImageUpload, postController.createPost);
router.patch('/:id', verifyToken, postImageUpload, postController.updatePost);
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;