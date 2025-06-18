import { Router } from 'express'
import {
    storeUser,
    deleteUser,
    indexUser,
    loginUser,
    resetPasswordRequestUser,
    resetPasswordUser,
    showUser,
    updateUser,
    getProfile,
} from '../controllers/userController'
import userUpload from '../middlewares/uploadMiddleware'
import authMiddleware from '../middlewares/authMiddleware'

const router: Router = Router()
/**
 * @swagger
 * /api/usuario/me:
 *   get:
 *     summary: Obtém informações do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna as informações do usuário autenticado, incluindo nome, e-mail, telefone, nível de consciência e se é monitor.
 *     responses:
 *       200:
 *         description: Informações do usuário
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/usuario/me', authMiddleware, getProfile)

/**
 * @swagger
 * /api/usuario:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               tokens:
 *                 type: string
 *               senha:
 *                 type: string
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               nivelConsciencia:
 *                 type: integer
 *                 description: Nível de conscientização do usuário (0-5)
 *               isMonitor:
 *                 type: boolean
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de perfil do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na criação do usuário
 */
router.post('/usuario', userUpload.single('avatar'), storeUser)

/**
 * @swagger
 * /api/usuario/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário para autenticação
 *               senha:
 *                 type: string
 *                 description: Senha do usuário para autenticação
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: '123e4567-e89b-12d3-a456-426614174000'
 *                       description: ID do usuário
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: 'usuario@example.com'
 *                       description: E-mail do usuário
 *                     nome:
 *                       type: string
 *                       format: string
 *                       example: 'Nome do Usuário'
 *                       description: Nome do usuário
 *                     telefone:
 *                       type: string
 *                       format: string
 *                       example: '11987654321'
 *                       description: Telefone do usuário
 *                     nivelConsciencia:
 *                       type: integer
 *                       format: int32
 *                       example: 3
 *                       description: Nível de conscientização do usuário (0-5)
 *                     isMonitor:
 *                       type: boolean
 *                       format: boolean
 *                       example: false
 *                       description: Indica se o usuário é monitor
 *         description: Login bem-sucedido, retorna um token JWT
 *       400:
 *         description: Credenciais inválidas ou erro de autenticação
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/usuario/login', loginUser)

/**
 * @swagger
 * /api/usuario/reset:
 *   post:
 *     summary: Inicia a solicitação de redefinição de senha
 *     tags: [Autenticação]
 *     description: Envia um token de redefinição para o e-mail do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *                 description: O e-mail do usuário que solicitou a redefinição de senha.
 *     responses:
 *       200:
 *         description: Token de redefinição enviado com sucesso
 *       400:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/usuario/reset', resetPasswordRequestUser)

/**
 * @swagger
 * /api/usuario/reset/{token}:
 *   post:
 *     summary: Completa a redefinição de senha
 *     tags: [Autenticação]
 *     description: Permite ao usuário definir uma nova senha usando o token de redefinição.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de redefinição de senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: A nova senha que o usuário deseja definir.
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Token expirado ou inválido, ou erro ao atualizar a senha
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/usuario/reset/:token', resetPasswordUser)

/**
 * @swagger
 * /api/usuario:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       400:
 *         description: Erro ao buscar usuários
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/usuario', authMiddleware, indexUser)

/**
 * @swagger
 * /api/usuario/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: Erro ao buscar usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/usuario/:id', authMiddleware, showUser)

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               nivelConsciencia:
 *                 type: integer
 *               isMonitor:
 *                 type: boolean
 *               senha:
 *                 type: string
 *                 description: Nova senha do usuário, caso queira alterar
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de perfil do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar o usuário
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
    '/usuario/:id',
    authMiddleware,
    userUpload.single('avatar'),
    updateUser,
)

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: Erro ao deletar o usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/usuario/:id', authMiddleware, deleteUser)

export default router
