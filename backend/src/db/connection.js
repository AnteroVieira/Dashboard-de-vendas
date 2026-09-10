import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../database.json');

// Configura o adaptador JSON
const adapter = new JSONFile(file);
const db = new Low(adapter, { produtos: [] });

export async function openDb() {
  await db.read();
  
  // Garante que a estrutura inicial existe
  db.data ||= { produtos: [] };
  await db.write();

  // Retorna um objeto adaptado para manter compatibilidade com os métodos comuns
  return {
    async all(query, params = []) {
      await db.read();
      return db.data.produtos;
    },
    async get(query, params = []) {
      await db.read();
      const id = params[0];
      return db.data.produtos.find(p => p.id === id);
    },
    async run(query, params = []) {
      await db.read();
      // Simulação simples de inserção baseada nas queries do projeto
      if (query.trim().toUpperCase().startsWith('INSERT')) {
        const novoProduto = {
          id: Date.now(),
          nome: params[0],
          categoria: params[1],
          PRECO: params[2],
          estoque: params[3]
        };
        db.data.produtos.push(novoProduto);
        await db.write();
        return { lastID: novoProduto.id };
      }
      await db.write();
      return { changes: 1 };
    },
    async exec(query) {
      // Ignora comandos DDL do SQLite já que o JSON gerencia sozinho
      return true;
    }
  };
}