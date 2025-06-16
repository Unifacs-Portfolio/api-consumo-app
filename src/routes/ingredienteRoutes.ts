import { Router } from 'express';
import { deletar, index, show, store, update } from '../controllers/ingredienteController';

const router = Router();

/**
 * @swagger
 * /api/ingredientes:
 *   get:
 *     summary: Lista todos os ingredientes
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 *       400:
 *         description: Erro ao listar os ingredientes
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/ingredientes', index);

/**
 * @swagger
 * /api/ingredientes:
 *   post:
 *     summary: Cria um novo ingrediente
 *     tags: [Ingredientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do ingrediente
 *               quantidade:
 *                 type: number
 *                 description: Quantidade do ingrediente
 *               medida:
 *                 type: string
 *                 description: Medida do ingrediente
 *               receitaId:
 *                 type: string
 *                 description: ID da receita associada ao ingrediente
 *                
 *     responses:
 *       201:
 *         description: Ingrediente criado com sucesso
 *       400:
 *         description: Erro ao criar o ingrediente
 *       500:
 *        description: Erro interno do servidor
 */
router.post('/ingredientes', store);

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   put:
 *     summary: Atualiza um ingrediente pelo ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ingrediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do ingrediente atualizado
 *               quantidade:
 *                  type: number
 *                  description: Quantidade do ingrediente atualizado
 *               medida:
 *                  type: string
 *                  description: Medida do ingrediente atualizado
 * 
 *     responses:
 *       200:
 *         description: Ingrediente atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar o ingrediente
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/ingredientes/:ingredienteId', update);

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   get:
 *     summary: Obtém um ingrediente pelo ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ingrediente
 *     responses:
 *       200:
 *         description: Detalhes do ingrediente
 *       400:
 *         description: Erro ao buscar o ingrediente
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *        description: Erro interno do servidor
 */
router.get('/ingredientes/:ingredienteId', show);

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   delete:
 *     summary: Remove um ingrediente pelo ID
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ingrediente
 *     responses:
 *       204:
 *         description: Ingrediente deletado com sucesso
 *       400:
 *         description: Erro ao deletar o ingrediente
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/ingredientes/:ingredienteId', deletar);

export default router;
