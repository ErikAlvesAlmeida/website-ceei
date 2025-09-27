const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Admin Login' });
});

router.get('/admin', (req, res) => {
  res.render('admin', { pageTitle: 'Painel de Administração' });
});

router.get('/administracao', (req, res) => {
  res.render('cargos', { pageTitle: 'Administração - CEEI' });
});

router.get('/blog', (req, res) => {
  res.render('blog', { pageTitle: 'Blog - CEEI' });
});

router.get('/blog/:id', (req, res) => {
  res.render('post', { pageTitle: 'Post - CEEI', postId: req.params.id });
});

module.exports = router;