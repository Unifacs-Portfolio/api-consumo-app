import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import {
    create, deletar, getAll,
    getAllByTheme, getAllNotVerifiedByTheme,
    getAllVerifiedByTheme, getByCode, getDicaByTemaAndSubtema,
    getSpecialistsDica, update, verify
} from '../controllers/dicaController';
import authMiddleware from '../middlewares/authMiddleware';
import multer from 'multer';
import type { Multer } from 'multer';

const router: Router = Router();
// Configuração do Multer
const upload: Multer = multer();

// Middleware para processar form-data
const processFormData = (req: Request, res: Response, next: NextFunction) => {
    upload.array('subtemas', 5)(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                message: 'Erro',
                detail: err.message
            });
        }
        if (err) {
            return res.status(500).json({
                message: 'Erro',
                detail: (err as Error).message
            });
        }
        next();
    });
};

/**
 * @swagger
 * /api/dicas:
 *   get:
 *     summary: Lista todas as dicas
 *     tags: [Dicas]
 *     responses:
 *       200:
 *         description: Lista de dicas
 *       400:
 *         description: Erro ao listar as dicas
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dicas', getAll);

/**
 * @swagger
 * /api/dicas:
 *   post:
 *     summary: Cria uma nova dica
 *     tags: [Dicas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário que cria a dica
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo da dica
 *               titulo:
 *                 type: string
 *                 description: Título da dica
 *               tema:
 *                 type: string
 *                 description: Tema relacionado à dica
 *               subtema:
 *                 type: string
 *                 description: Subtema relacionado à dica
 *     responses:
 *       201:
 *         description: Dica criada com sucesso
 *       400:
 *         description: Erro ao criar a dica ou o subtema não pertence ao tema
 *       404:
 *        description: O usuário com o email fornecido não foi encontrado ou o tema com o ID fornecido não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/dicas', authMiddleware, processFormData, create);

/**
 * @swagger
 * /api/dicas/{id}:
 *   put:
 *     summary: Atualiza uma dica
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 description: Conteúdo da dica
 *               titulo:
 *                 type: string
 *                 description: Título da dica
 *               tema:
 *                 type: string
 *                 description: Tema relacionado à dica
 *               subtema:
 *                 type: string
 *                 description: Subtema relacionado à dica
 *     responses:
 *       200:
 *         description: Dica atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a dica
 *       404:
 *         description: A dica com o ID fornecido não foi encontrada ou o tema com o ID fornecido não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/dicas/:id', authMiddleware, processFormData, update);

/**
 * @swagger
 * /api/dicas/{id}:
 *   get:
 *     summary: Obtém uma dica pelo ID
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica
 *     responses:
 *       200:
 *         description: Detalhes da dica
 *       400:
 *         description: Erro ao buscar a dica
 *       404:
 *         description: A dica com o ID fornecido não foi encontrada ou o tema com o ID fornecido não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dicas/:id', getByCode);

/**
 * @swagger
 * /api/dicas/{id}:
 *   delete:
 *     summary: Deleta uma dica pelo ID
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Dica deletada com sucesso
 *       400:
 *         description: Erro ao deletar a dica
 *       404:
 *         description: A dica com o ID fornecido não foi encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/dicas/:id', authMiddleware, deletar);

/**
 * @swagger
 * /api/dicas/{id}/verificar:
 *   patch:
 *     summary: Verifica uma dica
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da dica
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verifyBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dica verificada com sucesso
 *       400:
 *         description: Erro ao verificar a dica
 *       401:
 *         description: Acesso não autorizado
 *       403:
 *         description: O usuário não tem permissão para verificar a dica
 *       404:
 *         description: O usuário com o email fornecido não foi encontrado ou a dica com o ID fornecido não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/dicas/:id/verificar', authMiddleware, verify);

/**
 * @swagger
 * /api/{tema}/dicas:
 *   get:
 *     summary: Lista dicas por tema
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema da dica
 *     responses:
 *       200:
 *         description: Lista de dicas por tema
 *       400:
 *         description: Erro ao listar dicas por tema
 *       404:
 *         description: O tema não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/dicas', getAllByTheme);

/**
 * @swagger
 * /api/{tema}/dicas/verificadas:
 *   get:
 *     summary: Lista dicas verificadas por tema
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema da dica
 *     responses:
 *       200:
 *         description: Lista de dicas verificadas por tema
 *       400:
 *         description: Erro ao listar dicas verificadas por tema
 *       404: 
 *         description: O tema não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/dicas/verificadas', getAllVerifiedByTheme);

/**
 * @swagger
 * /api/{tema}/dicas/nao-verificadas:
 *   get:
 *     summary: Lista dicas não verificadas por tema
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema da dica
 *     responses:
 *       200:
 *         description: Lista de dicas não verificadas por tema
 *       400:
 *         description: Erro ao listar dicas não verificadas por tema
 *       404:
 *         description: O tema não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/dicas/nao-verificadas', getAllNotVerifiedByTheme);

/**
 * @swagger
 * /api/dicas/{tema}/{subtema}:
 *   get:
 *     summary: Lista dicas por tema e subtema
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema da dica
 *       - in: path
 *         name: subtema
 *         required: true
 *         schema:
 *           type: string
 *         description: Subtema da dica
 *     responses:
 *       200:
 *         description: Lista de dicas por tema e subtema
 *       400:
 *         description: Erro ao listar dicas por tema e subtema
 *       404:
 *         description: O tema ou subtema não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dicas/:tema/:subtema', getDicaByTemaAndSubtema);

/**
 * @swagger
 * /api/{tema}/dicas/especialistas:
 *   get:
 *     summary: Lista dicas de especialistas por tema
 *     tags: [Dicas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema da dica
 *     responses:
 *       200:
 *         description: Lista de dicas de especialistas por tema
 *       400:
 *         description: Erro ao listar dicas de especialistas
 *       404:
 *         description: O tema não existe
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/dicas/especialistas', getSpecialistsDica);

export default router;
