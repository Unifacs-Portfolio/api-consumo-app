import { Router } from 'express';
import temaController from '../controllers/temaController';
import authMiddleware from '../middlewares/authMiddleware'; 

const router: Router = Router();
/**
 * @swagger
 * tags:
 *   name: Temas
 *   description: Endpoints relacionados a temas e subtemas
 */

/**
 * @swagger
 * /api/tema:
 *   get:
 *     summary: Lista todos os temas
 *     tags: [Temas]
 *     responses:
 *       200:
 *         description: Lista de temas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 # TODO: Defina aqui as propriedades de um Tema
 *                 # Exemplo:
 *                 # properties:
 *                 #   id:
 *                 #     type: integer
 *                 #   descricao:
 *                 #     type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 # TODO: Defina aqui as propriedades de um Tema
 *                 # Exemplo:
 *                 # properties:
 *                 #   id:
 *                 #     type: integer
 *                 #   descricao:
 *                 #     type: string
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema', authMiddleware, temaController.index);

/**
 * @swagger
 * /api/tema/{id}:
 *   get:
 *     summary: Verifica se um tema existe por ID
 *     tags: [Temas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tema
 *     responses:
 *       200:
 *         description: Tema encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Tema não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:id', authMiddleware, temaController.checkIfExists);

/**
 * @swagger
 * /api/tema/{id}:
 *   delete:
 *     summary: Remove um tema por ID
 *     tags: [Temas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tema
 *     responses:
 *       204:
 *         description: Tema deletado
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/tema/:id', authMiddleware, temaController.delete);

/**
 * @swagger
 * /api/tema/{tema}/subtemas:
 *   get:
 *     summary: Lista subtemas de um tema
 *     tags: [Temas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do tema
 *     responses:
 *       200:
 *         description: Lista de subtemas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subtema:
 *                     type: string
 *                     example: "NomeDoSubtema"
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:tema/subtemas', authMiddleware, temaController.getSubtemasByTema);

export default router;