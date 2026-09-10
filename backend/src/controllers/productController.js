import { openDb } from '../db/connection.js';

export const getProducts = async (req, res) => {
  try {
    const db = await openDb();
    const produtos = await db.all('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar produtos.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque } = req.body;

    if (!nome || !categoria || preco == null || estoque == null) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const db = await openDb();
    const result = await db.run(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
      [nome, categoria, parseFloat(preco), parseInt(estoque)]
    );

    const novoProduto = {
      id: result.lastID,
      nome,
      categoria,
      preco: parseFloat(preco),
      estoque: parseInt(estoque)
    };

    if (req.io) {
      req.io.emit('produtoAtualizado', novoProduto);
    }

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar produto.' });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const db = await openDb();
    await db.run('DELETE FROM produtos');
    res.status(200).json({ message: 'Todos os produtos foram apagados com sucesso.' });
  } catch (error) {
    console.error('Erro ao limpar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao limpar produtos.' });
  }
};