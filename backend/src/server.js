import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Habilita o CORS para permitir requisições do frontend no Codespaces
app.use(cors({
  origin: '*', // Permite qualquer origem do Codespaces
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Configuração do Socket.io em tempo real
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Um usuário se conectou: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

// Disponibiliza o io globalmente ou nas rotas se necessário
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas da API
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});