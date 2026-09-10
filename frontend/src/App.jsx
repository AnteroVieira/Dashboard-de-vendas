import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Móveis');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');

 
  const API_URL = 'https://dashboard-de-vendas-bzyq.onrender.com/api/produtos';

  const categoriasOpcoes = [
    'Móveis',
    'Eletrodomésticos',
    'Moda',
    'Telefonia',
    'Informática',
    'Beleza'
  ];

  const carregarProdutos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          categoria,
          preco: Number(preco),
          estoque: Number(estoque)
        })
      });

      if (response.ok) {
        setNome('');
        setPreco('');
        setEstoque('');
        carregarProdutos();
      } else {
        alert('Erro ao cadastrar produto.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Cadastro de Produtos</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ padding: '8px' }}
        >
          {categoriasOpcoes.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Preço (R$)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Cadastrar Produto
        </button>
      </form>

      <h2>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {produtos.map((p) => (
            <li key={p.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '8px', borderRadius: '4px' }}>
              <strong>{p.nome}</strong> - {p.categoria} | R$ {p.preco || p.PRECO} | Estoque: {p.estoque}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}