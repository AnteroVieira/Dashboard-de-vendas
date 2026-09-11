import express from 'express';
import cors from 'cors';
import { openDb } from './db/connection.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste na raiz para confirmar que o Render acordou
app.get('/', (req, res) => {
  res.json({ status: 'API do Dashboard de Vendas online!' });
});

// Rota para listar produtos (suporta /produtos e /api/produtos)
const handleGetProdutos = async (req, res) => {
  try {
    const db = await openDb();
    const produtos = await db.all();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

app.get('/produtos', handleGetProdutos);
app.get('/api/produtos', handleGetProdutos);

// Rota para cadastrar produto (suporta /produtos e /api/produtos)
const handlePostProdutos = async (req, res) => {
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
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

app.post('/produtos', handlePostProdutos);
app.post('/api/produtos', handlePostProdutos);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});