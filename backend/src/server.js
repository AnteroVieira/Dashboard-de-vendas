import express from 'express';
import cors from 'cors';
import { openDb } from './db/connection.js';

const app = express();

// Configuração explícita do CORS para aceitar qualquer origem e método
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota raiz para teste
app.get('/', (req, res) => {
  res.json({ status: 'API online!' });
});

// Handlers de produtos
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

const cadastrarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
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