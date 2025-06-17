import type { Router } from 'express'
import type { Multer } from 'multer'
import express from 'express'
import multer from 'multer'
import {
    create,
    deletar,
    getAll,
    getAllByTheme,
    getAllNotVerifiedByTheme,
    getAllVerifiedByTheme,
    getById,
    getReceitasPorSubtemas,
    update,
    verify,
} from '../controllers/receitaController'

const router: Router = express.Router()

const storage = multer.memoryStorage()
// Configuração do Multer
const upload: Multer = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
})

const processFormData = upload.array('fotos', 8)

// Rotas

/**
 * @swagger
 * /api/receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 required: true
 *                 type: string
 *               conteudo:
 *                 required: true
 *                 type: string
 *               email:
 *                 required: true
 *                 type: string
 *               tema:
 *                 required: true
 *                 type: string
 *               subtema:
 *                 required: true
 *                 type: array
 *                 items:
 *                   type: string
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Imagens da receita (até 8 arquivos)
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *       400:
 *         description: Erro ao criar a receita
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

router.post('/receitas', processFormData, create)

/**
 * @swagger
 * /api/receitas:
 *   get:
 *     summary: Lista todas as receitas
 *     tags: [Receitas]
 *     responses:
 *       200:
 *         description: Lista de receitas
 *       400:
 *         description: Erro ao listar as receitas
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/receitas', getAll)

/**
 * @swagger
 * /api/receitas/{id}:
 *   get:
 *     summary: Obtém uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da receita
 *     responses:
 *       200:
 *         description: Detalhes da receita
 *       400:
 *         description: Erro ao buscar a receita
 *       404:
 *         description: Receita não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/receitas/:id', getById)

/**
 * @swagger
 * /api/receitas/{id}:
 *   put:
 *     summary: Atualiza uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da receita
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                  type: string
 *                  required: true
 *                  description: Título da receita
 *               conteudo:
 *                  type: string
 *                  required: true
 *                  description: Conteúdo da receita
 *               ingredientes:
 *                 type: string
 *                 required: true
 *                 description: Ingredientes da receita
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Novas imagens da receita (opcional)
 *     responses:
 *       200:
 *         description: Receita atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a receita
 *       404:
 *         description: Receita não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/receitas/:id', processFormData, update)

/**
 * @swagger
 * /api/receitas/{id}:
 *   delete:
 *     summary: Deleta uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID da receita
 *     responses:
 *       200:
 *         description: Receita deletada com sucesso
 *       400:
 *         description: Erro ao deletar a receita
 *       404:
 *         description: Receita não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/receitas/:id', deletar)

/**
 * @swagger
 * /api/receitas/{id}/verificar:
 *   patch:
 *     summary: Verifica uma receita
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da receita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: Email do usuário que está verificando a receita
 *     responses:
 *       200:
 *         description: Receita verificada com sucesso
 *       400:
 *         description: O usuário com esse email não é um monitor
 *       404:
 *         description: O usuário com esse email não foi encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/receitas/:id/verificar', verify)

/**
 * @swagger
 * /api/{tema}/receitas:
 *   get:
 *     summary: Lista receitas por tema
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema das receitas
 *     responses:
 *       200:
 *         description: Lista de receitas por tema
 *       400:
 *         description: Erro ao listar receitas por tema
 *       404:
 *         description: Nenhuma receita encontrada para o tema
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/receitas', getAllByTheme)

/**
 * @swagger
 * /api/{tema}/receitas/verificadas:
 *   get:
 *     summary: Lista receitas verificadas por tema
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema das receitas
 *     responses:
 *       200:
 *         description: Lista de receitas verificadas por tema
 *       400:
 *         description: Erro ao listar receitas verificadas por tema
 *       404:
 *         description: Nenhuma receita verificada encontrada para o tema
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/receitas/verificadas', getAllVerifiedByTheme)

/**
 * @swagger
 * /api/{tema}/receitas/nao-verificadas:
 *   get:
 *     summary: Lista receitas não verificadas por tema
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema das receitas
 *     responses:
 *       200:
 *         description: Lista de receitas não verificadas por tema
 *       400:
 *         description: Erro ao listar receitas não verificadas por tema
 *       404:
 *        description: Nenhuma receita não verificada encontrada para o tema
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:tema/receitas/nao-verificadas', getAllNotVerifiedByTheme)

/**
 * @swagger
 * /api/receitas/{tema}/{subtema}:
 *   get:
 *     summary: Lista receitas por tema e subtema
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: tema
 *         required: true
 *         schema:
 *           type: string
 *         description: Tema das receitas
 *       - in: path
 *         name: subtema
 *         required: true
 *         schema:
 *           type: string
 *         description: Subtema das receitas
 *     responses:
 *       200:
 *         description: Lista de receitas por tema e subtema
 *       400:
 *         description: Erro ao listar receitas por tema e subtema
 *       404:
 *         description: Nenhuma receita encontrada para os subtemas especificados
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/receitas/:tema/:subtema', getReceitasPorSubtemas)

export default router
