import { Router } from 'express'
import temaController from '../controllers/temaController'
import authMiddleware from '../middlewares/authMiddleware'

const router: Router = Router();

/**
 * @swagger
 * /api/tema:
 *   get:
 *     summary: Lista todos os temas
 *     tags: [Tema]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de temas
 *       400:
 *         description: Erro ao listar os temas
 *       401:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema', authMiddleware, temaController.index);

/**
 * @swagger
 * /api/tema/{id}:
 *   get:
 *     summary: Verifica se um tema existe por ID
 *     tags: [Tema]
 *     security:
 *      - bearerAuth: []
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
 *       400:
 *         description: Erro ao buscar o tema
 *       401:
 *         description: Acesso não autorizado
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:id', authMiddleware, temaController.checkIfExists);

/**
 * @swagger
 * /api/tema/{id}:
 *   delete:
 *     summary: Remove um tema pelo ID
 *     tags: [Tema]
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Erro ao deletar o tema
 *       401: 
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/tema/:id', authMiddleware, temaController.delete);

/**
 * @swagger
 * /api/tema/{tema}/subtemas:
 *   get:
 *     summary: Lista subtemas de um tema
 *     tags: [Tema]
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Erro ao listar os subtemas
 *       401:
 *         description: Acesso não autorizado
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:tema/subtemas', authMiddleware, temaController.getSubtemasByTema);

export default router;
