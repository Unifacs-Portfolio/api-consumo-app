import { Router } from 'express';
import { destroy, index, show, store, update, validateAnswer } from '../controllers/quizController';

const router = Router();

/**
 * @swagger
 * /api/quizes:
 *   get:
 *     summary: Lista todos os quizes
 *     tags: [Quizes]
 *     responses:
 *       200:
 *         description: Lista de quizes
 *       400:
 *         description: Erro ao listar os quizes
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/quizes', index);

/**
 * @swagger
 * /api/quizes:
 *   post:
 *     summary: Cria um novo quiz
 *     tags: [Quizes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pergunta:
 *                 type: string
 *                 description: Pergunta do quiz
 *               resposta_verdadeira:
 *                 type: string
 *                 description: Resposta correta do quiz
 *               ordem:
 *                 type: integer
 *                 description: Ordem de apresentação do quiz
 *               app:
 *                 type: string
 *                 description: Aplicativo relacionado ao quiz
 *               titulo:
 *                 type: string
 *                 description: Título do quiz
 *               descricao:
 *                 type: string
 *                 description: Descrição do quiz
 *     responses:
 *       201:
 *         description: Quiz criado com sucesso
 *       400:
 *         description: Erro ao criar o quiz
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/quizes', store);

/**
 * @swagger
 * /api/quizes/{quizId}:
 *   get:
 *     summary: Obtém um quiz pelo ID
 *     tags: [Quizes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do quiz
 *     responses:
 *       200:
 *         description: Detalhes do quiz
 *       404:
 *         description: Quiz não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/quizes/:id', show);

/**
 * @swagger
 * /api/quizes/{quizId}:
 *   put:
 *     summary: Atualiza um quiz pelo ID
 *     tags: [Quizes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pergunta:
 *                 type: string
 *                 description: Pergunta atualizada do quiz
 *               resposta_verdadeira:
 *                 type: string
 *                 description: Resposta correta atualizada
 *               ordem:
 *                 type: integer
 *                 description: Nova ordem do quiz
 *               app:
 *                 type: string
 *                 description: Aplicativo atualizado
 *               titulo:
 *                 type: string
 *                 description: Título atualizado
 *               descricao:
 *                 type: string
 *                 description: Descrição atualizada
 *     responses:
 *       200:
 *         description: Quiz atualizado com sucesso
 *       404:
 *         description: Quiz não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/quizes/:id', update);

/**
 * @swagger
 * /api/quizes/{quizId}:
 *   delete:
 *     summary: Remove um quiz pelo ID
 *     tags: [Quizes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do quiz
 *     responses:
 *       204:
 *         description: Quiz deletado com sucesso
 *       404:
 *         description: Quiz não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/quizes/:id', destroy);


router.post('/quizes/:id/validar', validateAnswer)
export default router;