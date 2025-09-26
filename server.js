// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');


const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'CEEI - Início' });
});

// Usar as Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}. Acesse em http://localhost:${PORT}`);
});