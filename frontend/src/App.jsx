import React, { useState, useEffect } from 'react';
import './App.css';

// URL do backend hospedado no Render (com https explícito)
const API_URL = 'https://dashboard-de-vendas-bzyq.onrender.com';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Função para buscar produtos cadastrados
  const buscarProdutos = async () => {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setErro('Não foi possível carregar os produtos do servidor.');
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função para cadastrar um novo produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          categoria,
          preco: Number(preco),
          estoque: Number(estoque),
        }),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar produto');

      // Limpa os campos e atualiza a lista
      setNome('');
      setCategoria('');
      setPreco('');
      setEstoque('');
      await buscarProdutos();
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setErro('Erro ao cadastrar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard de Vendas - Cadastro de Produtos</h1>

      {erro && <div style={{ color: 'red', marginBottom: '15px' }}>{erro}</div>}

      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Cadastrar Produto</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Estoque:</label>
          <input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#007BFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', fontSize: '16px' }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>

      <h2>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#007BFF', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Categoria</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Preço</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.nome}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.categoria}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>R$ {Number(p.preco).toFixed(2)}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.estoque}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;