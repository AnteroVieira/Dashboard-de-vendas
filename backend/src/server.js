import express from 'express';
import cors from 'cors';
import { openDb } from './db/connection.js';

const app = express();

// Libera o CORS para qualquer frontend (como o seu Surge)
app.use(cors());
app.use(express.json());

// Rota para listar produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const db = await openDb();
    const produtos = await db.all('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500.0).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para cadastrar produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO produtos (nome, categoria, PRECO, estoque) VALUES (?, ?, ?, ?)',
      [nome, categoria, preco, estoque]
    );

    res.status(201).json({ id: result.lastID, message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500.0).json({ error: 'Erro interno no servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});