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

// Listar produtos
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

// Cadastrar produto
const cadastrarProduto = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;
    
    // Garante conversão numérica correta
    const precoNum = parseFloat(preco) || 0;
    const estoqueNum = parseInt(estoque, 10) || 0;

    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
      [nome, categoria, precoNum, estoqueNum]
    );

    res.status(201).json({ id: result.lastID, message: 'Cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

app.post('/produtos', cadastrarProduto);
app.post('/api/produtos', cadastrarProduto);

// Deletar produto por ID (Essencial para o botão excluir funcionar)
const deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await openDb();
    
    const result = await db.run('DELETE FROM produtos WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

app.delete('/produtos/:id', deletarProduto);
app.delete('/api/produtos/:id', deletarProduto);

// --- SERVIR O FRONTEND (REACT) EM PRODUÇÃO ---
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});