import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import userUpload from '../middlewares/uploadMiddleware'; 

vi.mock('../middlewares/authMiddleware', () => ({
  __esModule: true,
  default: vi.fn((req, res, next) => next()) 
}));

vi.mock('../controllers/userController', () => ({
  storeUser: vi.fn((req, res) => res.status(201).send('Usuário criado com sucesso')),
  loginUser: vi.fn((req, res) => res.status(200).json({ token: 'mockToken' })),
  resetPasswordRequestUser: vi.fn((req, res) => res.status(200).send('Token de redefinição enviado com sucesso')),
  resetPasswordUser: vi.fn((req, res) => res.status(200).send('Senha atualizada com sucesso')),
  indexUser: vi.fn((req, res) => res.status(200).json([{ email: 'usuario@example.com' }])),
  showUser: vi.fn((req, res) => res.status(200).json({ email: req.params.email })),
  updateUser: vi.fn((req, res) => res.status(200).send('Usuário atualizado com sucesso')),
  deleteUser: vi.fn((req, res) => res.status(200).send('Usuário deletado com sucesso')),
}));

const app = express();
app.use(express.json());
app.use(userRoutes); 

describe('Rotas de Usuário', () => {
  it('deve criar um novo usuário', async () => {
    const response = await request(app)
      .post('/api/usuario')
      .field('email', 'usuario@example.com')
      .field('senha', 'senha123')
      .field('nome', 'Usuário Teste')
      .field('telefone', '123456789')
      .field('nivelConsciencia', 3)
      .field('isMonitor', true)
      .attach('fotoUsu', Buffer.from('test', 'utf-8'), 'foto.jpg'); 

    expect(response.status).toBe(201);
    expect(response.text).toBe('Usuário criado com sucesso');
  });

  it('deve realizar o login do usuário', async () => {
    const response = await request(app)
      .post('/api/usuario/login')
      .send({
        email: 'usuario@example.com',
        senha: 'senha123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('mockToken');
  });

  it('deve solicitar a redefinição de senha', async () => {
    const response = await request(app)
      .post('/api/usuario/reset')
      .send({
        email: 'usuario@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Token de redefinição enviado com sucesso');
  });

  it('deve redefinir a senha com o token', async () => {
    const response = await request(app)
      .post('/api/usuario/reset/mockToken')
      .send({
        newPassword: 'novaSenha123',
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Senha atualizada com sucesso');
  });

  it('deve listar todos os usuários', async () => {
    const response = await request(app)
      .get('/api/usuario')
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ email: 'usuario@example.com' }]);
  });

  it('deve retornar usuário pelo e-mail', async () => {
    const response = await request(app)
      .get('/api/usuario/usuario@example.com')
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('usuario@example.com');
  });

  it('deve atualizar o usuário', async () => {
    const response = await request(app)
      .put('/api/usuario/usuario@example.com')
      .set('Authorization', 'Bearer mockToken')
      .send({
        nome: 'Novo Nome',
        telefone: '987654321',
        nivelConsciencia: 4,
        isMonitor: false,
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Usuário atualizado com sucesso');
  });

  it('deve deletar o usuário pelo e-mail', async () => {
    const response = await request(app)
      .delete('/api/usuario/usuario@example.com')
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Usuário deletado com sucesso');
  });
});
