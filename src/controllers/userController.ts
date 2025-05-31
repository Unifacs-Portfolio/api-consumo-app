import { error } from 'node:console'
import argon2 from 'argon2'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User'
import { supabase } from '../supabase/client'

class UserController {
    async store(req: Request, res: Response): Promise<void> {
        let uploadedImagePath = null
        try {
            const user = new User({
                email: req.body.email,
                tokens: req.body.tokens,
                senha: req.body.senha,
                nome: req.body.nome,
                telefone: req.body.telefone,
                nivelConsciencia: req.body.nivelConsciencia,
                isMonitor: req.body.isMonitor,
                fotoUsu: null,
            })

            const { valid, errors } = user.validate()
            if (!valid) res.status(400).json({ errors })

            let fotoUsuarioURL = null

            // Se a imagem foi carregada
            if (req.file) {
                const uploadResult = await uploadImage(req.file)

                if (!uploadResult) {
                    res.status(500).json({
                        error: 'Erro ao fazer upload da imagem',
                    })
                    return
                }
                fotoUsuarioURL = uploadResult.url
                uploadedImagePath = uploadResult.path
            }

            // O hash da senha é gerado aqui
            const hashedPassword = await argon2.hash(user.senha)

            const { data, error } = await supabase.from('usuarios').insert([
                {
                    email: user.email,
                    senha: hashedPassword,
                    nome: user.nome,
                    telefone: user.telefone,
                    nivelConsciencia: user.nivelConsciencia,
                    isMonitor: user.isMonitor,
                    tokens: user.tokens,
                    fotoUsu: fotoUsuarioURL,
                },
            ])

            if (error) {
                if (uploadedImagePath) {
                    await supabase.storage
                        .from('fotoPerfil')
                        .remove([uploadedImagePath])
                }
                res.status(500).json({ errors: [error.message] })
                return
            }

            res.status(201).json({ message: 'Usuário criado com sucesso' })
            return
        } catch (e) {
            if (uploadedImagePath) {
                await supabase.storage
                    .from('fotoPerfil')
                    .remove([uploadedImagePath])
            }
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] })
                return
            }
        }
    }

    //funcionando pos alteracao bd
    async index(req: Request, res: Response): Promise<void> {
        try {
            const { data: users, error } = await supabase
                .from('usuarios')
                .select(
                    'email, nome, telefone, nivelConsciencia, isMonitor, fotoUsu',
                )

            if (error) throw error

            res.json(users)
            return
        } catch (e) {
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] })
                return
            }
        }
    }
    //funcionando pos alteracao bd
    async show(req: Request, res: Response): Promise<void> {
        try {
            const { data: user, error } = await supabase
                .from('usuarios')
                .select(
                    'email, nome, telefone, nivelConsciencia, isMonitor, fotoUsu',
                )
                .eq('email', req.params.email)
                .single()

            if (error || !user) {
                res.status(404).json({ errors: ['Usuário não encontrado'] })
                return
            }

            res.json(user)
            return
        } catch (e) {
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] })
                return
            }
        }
    }
    //Funcionando pos alteracao
    async update(req: Request, res: Response): Promise<void> {
        let uploadedImagePath = null
        try {
            const { data: user, error: fetchError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', req.params.email)
                .single()

            if (fetchError || !user) {
                res.status(400).json({ errors: ['Usuário não encontrado'] })
                return
            }

            let fotoUsuarioURL = user['Foto.usu']

            if (req.file) {
                const uploadResult = await uploadImage(req.file)

                if (!uploadResult) {
                    res.status(500).json({
                        error: 'Erro ao fazer upload da imagem',
                    })
                    return
                }

                fotoUsuarioURL = uploadResult.url
                uploadedImagePath = uploadResult.path
            }

            // Prepare the data to be updated
            const updatedData = { ...req.body, fotoUsu: fotoUsuarioURL }

            // Verificação e hash da senha
            if (req.body.senha) {
                // Use 'senha' em minúsculas
                console.log('Hashing a senha...')
                updatedData.senha = await argon2.hash(req.body.senha.trim()) // 'senha' em minúsculas
            }

            const { error: updateError } = await supabase
                .from('usuarios')
                .update(updatedData)
                .eq('email', req.params.email)

            if (updateError) throw updateError

            res.json({ message: 'Usuário atualizado com sucesso' })
            return
        } catch (e) {
            if (e instanceof Error) {
                console.error('Erro ao atualizar usuário:', e.message)
            }

            if (uploadedImagePath) {
                await supabase.storage
                    .from('fotoPerfil')
                    .remove([uploadedImagePath])
            }
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] })
                return
            }
        }
    }

    // Funcionando pos alteracao
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { data: user, error: fetchError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', req.params.email)
                .single()

            if (fetchError || !user) {
                res.status(400).json({ errors: ['Usuário não encontrado'] })
                return
            }

            const { error: deleteError } = await supabase
                .from('usuarios')
                .delete()
                .eq('email', req.params.email)

            if (deleteError) throw deleteError

            res.json({ message: 'Usuário deletado com sucesso' })
            return
        } catch (e) {
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] })
                return
            }
        }
    }
    async loginUser(req: Request, res: Response): Promise<void> {
        const { email, senha } = req.body

        try {
            console.log('Iniciando login para o email:', email)

            const { data: user, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single()

            if (error || !user) {
                console.error(
                    'Erro ao buscar usuário ou usuário não encontrado:',
                    error,
                )
                res.status(400).json({
                    error: 'Usuário não encontrado ou erro na busca',
                })
                return
            }

            console.log('Usuário encontrado:', user)
            if (!user.senha || !user.senha.startsWith('$')) {
                console.error(
                    'Senha inválida ou não é um hash no banco de dados.',
                )
                res.status(500).json({ error: 'Erro no registro do usuário' })
                return
            }

            const validPassword = await argon2.verify(user.senha, senha)

            if (!validPassword) {
                console.error('Senha inválida para o usuário:', email)
                res.status(401).json({ error: 'Credenciais inválidas' })
                return
            }

            console.log('Senha verificada com sucesso. Gerando token...')

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string,
            )

            console.log('Token gerado com sucesso:', token)

            res.status(200).json({ message: 'Login bem-sucedido', token })
            return
        } catch (e) {
            if (e instanceof Error) {
                console.error('Erro no processo de login:', e.message)
                res.status(500).json({ error: 'Erro interno do servidor' })
                return
            }
        }
    }

    async resetPasswordRequest(req: Request, res: Response): Promise<void> {
        const { email } = req.body

        try {
            const { data: user, error } = await supabase
                .from('usuarios')
                .select('email')
                .eq('email', email)
                .single()

            if (error || !user) {
                res.status(400).json({ error: 'Usuário não encontrado' })
                return
            }

            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' },
            )

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Redefinição de Senha',
                text: `Seu token de redefinição de senha é: ${token}`,
                html: `<p>Seu token de redefinição de senha é:</p><p><strong>${token}</strong></p>`,
            }

            await transporter.sendMail(mailOptions)

            res.status(200).json({
                message: 'Token de redefinição de senha enviado com sucesso',
            })
            return
        } catch (e) {
            console.error(e)
            res.status(500).json({ error: 'Erro interno do servidor' })
            return
        }
    }
    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token } = req.params
        const { newPassword } = req.body

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string,
            ) as { email: string }
            const email = decoded.email

            const hashedPassword = await argon2.hash(newPassword)

            const { error } = await supabase
                .from('usuarios')
                .update({ senha: hashedPassword })
                .eq('email', email)

            if (error) {
                res.status(400).json({ error: 'Erro ao atualizar a senha' })
                return
            }

            res.status(200).json({ message: 'Senha atualizada com sucesso' })
            return
        } catch (e) {
            if (error.name === 'TokenExpiredError') {
                res.status(400).json({ error: 'Token expirado' })
                return
            } 
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({ error: 'Token inválido' })
                return
            }

            console.error(e)
            res.status(500).json({ error: 'Erro interno do servidor' })
            return
        }
    }
}
async function uploadImage(file: Express.Multer.File) {
    try {
        const uniqueFileName = `${uuidv4()}-${file.originalname}`
        const { data, error } = await supabase.storage
            .from('fotoPerfil')
            .upload(uniqueFileName, file.buffer, {
                contentType: file.mimetype,
            })

        if (error)
            throw new Error(`Erro ao fazer upload da imagem: ${error.message}`)

        const { data: publicURL } = supabase.storage
            .from('fotoPerfil')
            .getPublicUrl(data.path)

        return { url: publicURL.publicUrl, path: data.path }
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(`Erro ao fazer upload da imagem: ${e.message}`)
        }
    }
}

export default new UserController()
