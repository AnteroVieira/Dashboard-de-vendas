import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Como estamos rodando de dentro de src/db, subimos duas pastas para salvar na raiz da pasta backend
const file = join(__dirname, '../../database.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, { produtos: [] });

export async function openDb() {
  await db.read();
  db.data ||= { produtos: [] };
  await db.write();

  return {
    async all() {
      await db.read();
      return db.data.produtos;
    },
    async run(query, ...params) {
      await db.read();
      const queryParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
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
      await db.write();
      return { changes: 1 };
    }
  };
}