import request from 'supertest';
import { describe, it, expect, vi} from 'vitest';
import {app} from '../app';
import Tema from '../models/Tema'
import { Request, Response, NextFunction } from 'express'
import { PrismaTemaRepository } from '../repositories/prisma/PrismaTemaRepository'


    vi.spyOn(PrismaTemaRepository.prototype, 'delete').mockResolvedValueOnce()


    vi.mock('../middlewares/authMiddleware', () => ({
      default: (req: Request, res: Response, next: NextFunction) => next() 
    }))

describe('GET /api/tema', () => {
    

    it("Returns list of themes [200]", async () => {
     const response = await request(app).get('/api/tema').set('Authorization', "token");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    });


//     it('token not provided error [401]', async () => {
//         const response = await request(app).get('/api/tema');

//         expect(response.status).toBe(401);
//         expect(response.body).toEqual({ message: 'Token não fornecido' });
//     });


//     it('invalid token error [400]', async () => {
//         const response = await request(app).get('/api/tema').set('Authorization', 'invalide-token');

//         expect(response.status).toBe(400);
//         expect(response.body).toEqual({ message: 'Token Inválido ou erro de autenticação' });
//     });

});


describe("GET /api/tema/:id no Authentication", () => {
     vi.doMock('../models/Tema', () => ({
         default: {
             findById: vi.fn(),
         }
     }))

    it("[ID validation success [200]", async () =>{
        vi.spyOn(Tema, 'findById').mockResolvedValueOnce({ id: 1, descricao: 'Tema Teste' })

        const response = await request(app).get('/api/tema/1').set('Authorization', "token")

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ exists: true })
    })
    
     it('Id invalid error [400]', async () => {
        const response = await request(app).get('/api/tema/a').set('Authorization',  "token");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'ID inválido');
    });
})


// describe("GET /api/tema/:id no authentication", () => {
//  it('token not provided error [401]', async () => {
//     const response = await request(app).get('/api/tema/1');

//     expect(response.status).toBe(401)
//     expect(response.body).toHaveProperty('message', 'Token não fornecido')
//  })

//  it('invalid token error [400]', async () => {
        
//     const response = await request(app).get('/api/tema/1').set('Authorization', 'inválido');

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ message: 'Token Inválido ou erro de autenticação' });

//   });
// })


describe("DELETE /api/tema/:id no authentication", () => {    
  it('deve deletar o tema com sucesso [204]', async () => {
   vi.spyOn(Tema, 'findById').mockResolvedValueOnce({ id: 1, descricao: 'Tema Teste' })
   const tema = await Tema.findById(1)

   const response = await request(app).delete(`/api/tema/${tema.id}´`).set("Authorization", "token")

   expect(response.status).toBe(204)
  })

// it('token not provided error [401]', async () => {
//    const response = await request(app).get('/api/tema');

//    expect(response.status).toBe(401);
//    expect(response.body).toEqual({ message: 'Token não fornecido' });
// });


// it('invalid token error [400]', async () => {
//    const response = await request(app).get('/api/tema').set('Authorization', 'invalide-token');

//    expect(response.status).toBe(400);
//    expect(response.body).toEqual({ message: 'Token Inválido ou erro de autenticação' });
// });
})




