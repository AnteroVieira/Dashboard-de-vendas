import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Móveis');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');

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
      const response = await fetch('https://studious-xylophone-74gwg4447qj2w674-3001.app.github.dev/api/produtos');
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
      const response = await fetch('https://studious-xylophone-74gwg4447qj2w674-3001.app.github.dev/api/produtos', {
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
        setCategoria('Móveis');
        setPreco('');
        setEstoque('');
        carregarProdutos();
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const limparLista = async () => {
    if (!window.confirm('Tem certeza que deseja apagar permanentemente todos os produtos do banco de dados?')) {
      return;
    }

    try {
      const response = await fetch('https://studious-xylophone-74gwg4447qj2w674-3001.app.github.dev/api/produtos', {
        method: 'DELETE'
      });

      if (response.ok) {
        setProdutos([]);
      }
    } catch (error) {
      console.error('Erro ao limpar produtos:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#eef2f7'
    }}>
      <div style={{ width: '100%', maxWidth: '550px', background: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
        <h1 style={{ textAlign: 'center', color: '#1e3a8a', fontSize: '24px', marginBottom: '25px' }}>Cadastro de Produtos</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Nome:</label><br />
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Categoria:</label><br />
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', backgroundColor: '#fff' }}
            >
              {categoriasOpcoes.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Preço (R$):</label><br />
            <input 
              type="number" 
              step="0.01" 
              value={preco} 
              onChange={(e) => setPreco(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>Estoque:</label><br />
            <input 
              type="number" 
              value={estoque} 
              onChange={(e) => setEstoque(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' }}>
            Cadastrar Produto
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '20px', margin: 0 }}>Lista de Produtos</h2>
          {produtos.length > 0 && (
            <button 
              onClick={limparLista}
              style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              Limpar Lista
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {produtos.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>Nenhum produto cadastrado ainda.</p>
          ) : (
            produtos.map((prod) => (
              <div key={prod.id} style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', background: '#f8fafc' }}>
                <strong style={{ color: '#1e293b' }}>{prod.nome}</strong> - <span style={{ color: '#0284c7', fontWeight: '500' }}>{prod.categoria}</span><br />
                <span style={{ color: '#475569', fontSize: '14px' }}>Preço: R$ {Number(prod.preco).toFixed(2)} | Estoque: {prod.estoque}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;