import express from 'express';
import cors from 'cors';
import { openDb } from './db/connection.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rota raiz para teste de status
app.get('/', (req, res) => {
  res.json({ status: 'API online!' });
});

// Handler unificado para listar produtos (funciona com /produtos e /api/produtos)
const listarProdutos = async (req, res) => {
  try {
    const db = await openDb();
    const produtos = await db.all();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

app.get('/produtos', listarProdutos);
app.get('/api/produtos', listarProdutos);

// Handler unificado para cadastrar produtos (funciona com /produtos e /api/produtos)
const cadastrarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO produtos (nome, categoria, PRECO, estoque) VALUES (?, ?, ?, ?)',
      [nome, categoria, preco, estoque]
    );

    res.status(201).json({ id: result.lastID, message: 'Cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

app.post('/produtos', cadastrarProduto);
app.post('/api/produtos', cadastrarProduto);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});