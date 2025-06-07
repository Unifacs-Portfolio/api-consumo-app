import express from 'express';
import type { Router }  from 'express';
import {ingredienteController} from '../controllers/ingredienteController';

const router: Router = express.Router();
/**
 * @swagger
 * /api/ingredientes:
 *   get:
 *     summary: Lista todos os ingredientes
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Lista de ingredientes retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/ingredientes', ingredienteController.listAll as any)

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
 *             required:
 *               - nomeIngrediente
 *               - quantidade
 *               - medida
 *               - postagemId
 *             properties:
 *               nomeIngrediente:
 *                 type: string
 *               quantidade:
 *                 type: number
 *               medida:
 *                 type: string
 *               postagemId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingrediente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/ingredientes', ingredienteController.store as any)

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   get:
 *     summary: Retorna um ingrediente específico
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
 *         description: Ingrediente encontrado
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/ingredientes/:ingredienteId', ingredienteController.show as any)

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   put:
 *     summary: Atualiza um ingrediente existente
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
 *             required:
 *               - nomeIngrediente
 *               - quantidade
 *               - medida
 *             properties:
 *               nomeIngrediente:
 *                 type: string
 *               quantidade:
 *                 type: number
 *               medida:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ingrediente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/ingredientes/:ingredienteId', ingredienteController.update as any)

/**
 * @swagger
 * /api/ingredientes/{ingredienteId}:
 *   delete:
 *     summary: Remove um ingrediente
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
 *       404:
 *         description: Ingrediente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/ingredientes/:ingredienteId', ingredienteController.delete as any)

export default router