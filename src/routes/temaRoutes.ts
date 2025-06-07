import { Router } from 'express'
import temaController from '../controllers/temaController'
import authMiddleware from '../middlewares/authMiddleware'

const router: Router = Router()

/**
 * @swagger
 * /api/tema:
 *   get:
 *     summary: Lista os temas
 *     tags: [Tema]
 *     responses:
 *       200:
 *         description: Lista de temas
 *       400:
 *         description: Token inválido ou erro de autenticação
 *       401:
 *         description: Token não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema', authMiddleware, temaController.index)

/**
 * @swagger
 * /api/tema/{id}:
 *   get:
 *     summary: Lista um único tema
 *     tags: [Tema]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do tema
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tema encontrado com sucesso
 *       400:
 *         description: Token inválido ou erro de autenticação
 *       401:
 *         description: Token não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:id', authMiddleware, temaController.checkIfExists)

/**
 * @swagger
 * /api/tema/{id}:
 *   delete:
 *     summary: Deleta um tema pelo ID
 *     tags: [Tema]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do tema a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tema deletado com sucesso
 *       400:
 *         description: Token inválido ou erro de autenticação
 *       401:
 *         description: Token não fornecido
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/tema/:id', authMiddleware, temaController.delete)

/**
 * @swagger
 * /api/tema/{tema}/subtemas:
 *   get:
 *     summary: Lista os subtemas de um tema específico
 *     tags: [Tema]
 *     parameters:
 *       - name: tema
 *         in: path
 *         required: true
 *         description: Nome ou ID do tema
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de subtemas retornada com sucesso
 *       400:
 *         description: Token inválido ou erro de autenticação
 *       401:
 *         description: Token não fornecido
 *       404:
 *         description: Tema não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tema/:tema/subtemas', authMiddleware, temaController.getSubtemasByTema)

export default router
