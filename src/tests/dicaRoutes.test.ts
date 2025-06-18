import { describe, it, expect, vi } from "vitest";
import dicaController from "../controllers/dicaController";
import authMiddleware from "../middlewares/authMiddleware";
import {app} from "../app";
import request  from "supertest";   

vi.mock('../controllers/dicaController', () => ({
    default: {     
        getAll: vi.fn().mockResolvedValue({data: 'some data'}),
        create: vi.fn().mockResolvedValue({message: 'A dica foi criada com sucesso!'}),
        update: vi.fn().mockResolvedValue({message: 'A dica foi atualizada com sucesso!'}),
        getByCode: vi.fn().mockResolvedValue({data: 'some data'}),
        delete: vi.fn().mockResolvedValue({message: 'A dica foi deletada com sucesso!'}),
        verify: vi.fn().mockResolvedValue({message: 'a dica foi verificada com sucesso!'}),
        getAllByTheme: vi.fn().mockResolvedValue({data: 'some data'}),
        getAllVerifiedByTheme: vi.fn().mockResolvedValue({data: 'some data'}),
        getAllNotVerifiedByTheme: vi.fn().mockResolvedValue({data: 'some data'}),
        getDica: vi.fn().mockResolvedValue({data: 'some data'}),
        getSpecialistsDica: vi.fn().mockResolvedValue({data: 'some data'}),
     }
}));

vi.mock('../middlewares/authMiddleware', () =>({
    default: vi.fn((req, res, next)=> next()),
}));

describe('Rotas de Dica', () => {
    it('deve ser retornado todas as dicas (GET /dicas)', async() =>{
        const response = await request(app).get('/dica');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

    it('deve ser criado uma nova dica (POST /dicas)', async() =>{
        const response = await request(app)
            .post('/dicas')
            .set('Authorization', 'Bearer token-valido')
            .send({
                titulo: 'Exemplo de Dica',
                descricao: 'Essa é a descrição do teste de dica',
                tema: 'Exemplo de Tema',
                subtema: 'Exemplo de Subtema',
        });
        expect(response.status).toBe(201);
        expect(response.body.data).toBe('A dica foi criada com sucesso!');
    });

    it('deve ser atualizado uma dica (PUT /dicas/:id)', async() => {
        const response = await request(app)
            .post('/dicas/1')
            .set('Authorization', 'Bearer token-valido')
            .send({
                titulo: 'Atualização de Dica',
                descricao: 'Essa é a descrição da dica atualizada',
                tema: 'Atualização do Tema',
                subtema: 'Atualização do Subtema',
        });
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('A dica foi atualizada com sucesso!');
    });

    it('deve ser retornado uma dica pelo ID (GET /dicas/:id)', async() =>{
        const response = await request(app).get('/dica/1');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

    it('deve ser deletado uma dica (DELETE /dica/:id)', async() =>{
        const response = await request(app)
            .delete('/dicas/1')
            .set('Authorization', 'Bearer token-valido');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('A dica foi deletada com sucesso!');
    });

    it('deve ser verificado uma dica (PATCH /dicas/:id/verificar)', async() =>{
        const response = await request(app)
            .patch('dicas/1/verificar')
            .set('Authorization', 'Bearer token-valido');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('a dica foi verificada com sucesso!');
    });

     it('deve ser retornado todas as dicas pelo tema (GET /:tema/dicas)', async() =>{
        const response = await request(app).get('/tema/dica');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

     it('deve ser retornado todas as dicas verificadas pelo tema (GET /:tema/dicas/verificadas)', async() =>{
        const response = await request(app).get('/tema/dica/verificadas');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

     it('deve ser retornado todas as dicas não verificadas pelo tema (GET /:tema/dicas/nao-verificadas)', async() =>{
        const response = await request(app).get('/tema/dica/nao-verificadas');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

    it('deve ser retornado uma dica por tema e subtema (GET /dicas/:tema/:subtema)', async() =>{
        const response = await request(app).get('/dica/tema/subtema');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('some data');
    });

    it('deve retornar dicas de especialistas por tema (GET /:tema/dicas/especialistas)', async () => {
    const response = await request(app).get('/tema/dicas/especialistas');
    expect(response.status).toBe(200);
    expect(response.body.data).toBe('some data');
  });
});










