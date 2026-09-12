import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { openDb } from './db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// --- ROTAS DA API ---
const listarProdutos = async (req, res) => {
  try {
    const db = await openDb();
    const produtos = await db.all('SELECT * FROM produtos');
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

// --- SERVIR O FRONTEND (REACT) EM PRODUÇÃO ---
// Aponta para a pasta dist gerada pelo build do frontend
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Qualquer rota desconhecida redireciona para o index.html do React (essencial para SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});