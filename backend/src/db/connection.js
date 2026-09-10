import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../database.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, { produtos: [] });

export async function openDb() {
  await db.read();
  db.data ||= { produtos: [] };
  await db.write();

  return {
    async all(query, ...params) {
      await db.read();
      return db.data.produtos;
    },

    async get(query, ...params) {
      await db.read();
      const queryParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
      const id = queryParams[0];
      return db.data.produtos.find(p => p.id == id);
    },

    async run(query, ...params) {
      await db.read();
      
      // Normaliza os parâmetros (suporta tanto array quanto argumentos separados)
      const queryParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
      
      console.log('Executando Query:', query);
      console.log('Parâmetros recebidos:', queryParams);

      const upperQuery = query.trim().toUpperCase();

      if (upperQuery.startsWith('INSERT')) {
        const novoProduto = {
          id: Date.now(),
          nome: queryParams[0],
          categoria: queryParams[1],
          PRECO: Number(queryParams[2]),
          estoque: Number(queryParams[3])
        };
        db.data.produtos.push(novoProduto);
        await db.write();
        return { lastID: novoProduto.id };
      }

      if (upperQuery.startsWith('UPDATE')) {
        // Exemplo básico de update se necessário
        const id = queryParams[queryParams.length - 1];
        const produto = db.data.produtos.find(p => p.id == id);
        if (produto) {
          produto.nome = queryParams[0] ?? produto.nome;
          produto.categoria = queryParams[1] ?? produto.categoria;
          produto.PRECO = queryParams[2] != null ? Number(queryParams[2]) : produto.PRECO;
          produto.estoque = queryParams[3] != null ? Number(queryParams[3]) : produto.estoque;
          await db.write();
        }
        return { changes: 1 };
      }

      if (upperQuery.startsWith('DELETE')) {
        const id = queryParams[0];
        db.data.produtos = db.data.produtos.filter(p => p.id != id);
        await db.write();
        return { changes: 1 };
      }

      await db.write();
      return { changes: 1 };
    },

    async exec(query) {
      return true;
    }
  };
}