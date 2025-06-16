import { supabase } from '../db'
import type { RequestHandler } from 'express'
import { PrismaUsuarioRepository } from '../repositories/prisma/PrismaUsuarioRepository'
import { PrismaReceitaRepository } from '../repositories/prisma/PrismaReceitaRepository'
import { PrismaSubtemaRepository } from '../repositories/prisma/PrismaSubtemaRepository'
import { z } from 'zod'
import { PrismaTemaRepository } from '../repositories/prisma/PrismaTemaRepository'
import { StorageError } from '@supabase/storage-js'
import { tryParseJson } from '../utils/tryParseJson'
import { randomUUID } from 'node:crypto'

const BUCKET_NAME = 'photos'
const FOLDER_NAME = 'fotosReceita'

const receitaSchema = z.object({
    titulo: z.string({
        required_error: 'O título é obrigatório',
        invalid_type_error: 'O título deve ser uma string',
    }),
    conteudo: z.string({
        required_error: 'O conteúdo é obrigatório',
        invalid_type_error: 'O conteúdo deve ser uma string',
    }),
    email: z
        .string({
            required_error: 'O email do usuário é obrigatório',
            invalid_type_error: 'O email do usuário deve ser uma string',
        })
        .email({
            message: 'O email do usuário deve ser um email válido',
        }),
    tema: z.string({
        required_error: 'O tema é obrigatório',
        invalid_type_error: 'O tema deve ser uma string',
    }),
    subtemas: z.array(
        z
            .string({
                required_error: 'Subtemas são obrigatórios',
                invalid_type_error:
                    'Os subtemas devem ser uma lista de strings',
            })
            .min(1, 'Pelo menos um subtema é obrigatório'),
    ),
})
export const create: RequestHandler = async (req, res, next) => {
    const imageUrls: string[] = []
    try {
        const { titulo, conteudo, email, tema, subtemas } = receitaSchema.parse(
            req.body,
        )
        const { files } = req
        if (files && !Array.isArray(files)) {
            res.status(400).json({
                error: 'Os arquivos devem estar em um array',
            })
            return
        }
        const userRepository = new PrismaUsuarioRepository()
        const userExists = await userRepository.findByEmail({
            email,
        })
        if (!userExists) {
            res.status(404).json({ error: 'Usuário não encontrado' })
            return
        }
        const temaRepository = new PrismaTemaRepository()
        let temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            temaExists = await temaRepository.create({
                nome: tema,
                descricao: `Tema ${tema} criado automaticamente`,
            })
        }
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemasFetched: string[] = []
        for (const subtema of subtemas) {
            let subtemaExists = await subtemaRepository.findByName({
                nome: subtema,
            })
            if (!subtemaExists) {
                subtemaExists = await subtemaRepository.create({
                    tema_id: temaExists.id,
                    nome: subtema,
                    descricao: `Subtema ${subtema} criado automaticamente`,
                })
            }
            subtemasFetched.push(subtemaExists.id)
        }
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${randomUUID()}-${Date.now()}`
                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(`${FOLDER_NAME}/${fileName}`, file.buffer, {
                        contentType: file.mimetype,
                    })

                if (uploadError) {
                    throw uploadError
                }

                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(`${FOLDER_NAME}/${fileName}`)
                if (!publicUrl) {
                    throw new StorageError(
                        'Erro ao obter URL pública da imagem',
                    )
                }
                imageUrls.push(publicUrl)
            }
        }
        const receitaRepository = new PrismaReceitaRepository()
        const receitaCriada = await receitaRepository.create({
            conteudo,
            titulo,
            usuario_id: userExists.id,
            tema_id: temaExists.id,
            is_verify: false,
            image_source: JSON.stringify(imageUrls),
            receitas_subtemas: {
                create: [
                    ...subtemasFetched.map((subtemaId) => ({
                        subtema_id: subtemaId,
                        assunto: `Assunto relacionado ao subtema ${subtemaId}`,
                    })),
                ],
            },
        })
        const { image_source, ...propsOfReceita } = receitaCriada
        res.status(201).json({
            receita: {
                ...propsOfReceita,
                fotos: tryParseJson<string[]>(image_source),
            },
        })
        return
    } catch (error) {
        if (error instanceof StorageError) {
            for (const url of imageUrls) {
                const fileName: string | undefined = url
                    .split(`/${FOLDER_NAME}/`)
                    .pop()
                if (fileName) {
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove([`${FOLDER_NAME}/${fileName}`])
                }
            }
            console.error(error)
            res.status(500).json({
                error: 'Erro ao fazer upload das imagens',
            })
            return
        }
        next(error)
    }
}

export const getAll: RequestHandler = async (_req, res, next) => {
    try {
        const receitaRepository = new PrismaReceitaRepository()
        const temaRepository = new PrismaTemaRepository()
        const subtemaRepository = new PrismaSubtemaRepository()
        const receitas = await receitaRepository.findAll()
        const receitasFormatadas = await Promise.all(
            receitas.map(async (receita) => {
                const tema = await temaRepository.findById({
                    id: receita.tema_id,
                })
                const subtemas = await subtemaRepository.findByTemaId({
                    tema_id: receita.tema_id,
                })
                let fotos: string
                try {
                    fotos = JSON.parse(
                        Buffer.from(receita.image_source, 'base64').toString(
                            'utf-8',
                        ),
                    )
                } catch (_error) {
                    fotos = receita.image_source
                }
                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.is_verify,
                    usuarioId: receita.usuario_id,
                    tema: tema?.nome || null,
                    subtemas: subtemas.map((subtema) => subtema.nome),
                    ingredientes: receita.ingredientes,
                    fotos,
                }
            }),
        )
        res.status(200).json({ receitas: receitasFormatadas })
        return
    } catch (error) {
        next(error)
    }
}

export const getById: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const receitaRepository = new PrismaReceitaRepository()
        const receita = await receitaRepository.findById(id)
        if (!receita) {
            res.status(404).json({ error: 'Receita não encontrada' })
            return
        }
        res.status(200).json({ receita })
        return
    } catch (error) {
        next(error)
    }
}
const receitaUpdateSchema = z.object({
    titulo: z.string().optional(),
    conteudo: z.string().optional(),
    ingredientes: z
        .array(
            z.object({
                nome: z.string(),
                quantidade: z.string(),
                medida: z.string(),
            }),
        )
        .optional(),
})
export const update: RequestHandler = async (req, res, next) => {
    const imageUrls: string[] = []
    try {
        const { titulo, conteudo, ingredientes } = receitaUpdateSchema.parse(
            req.body,
        )
        const { id } = req.params
        const { files } = req
        if (files && !Array.isArray(files)) {
            res.status(400).json({
                error: 'Os arquivos devem estar em um array',
            })
            return
        }
        const receitaRepository = new PrismaReceitaRepository()
        const receita = await receitaRepository.findById(id)
        if (!receita) {
            res.status(404).json({ error: 'Receita não encontrada' })
            return
        }
        if (files && files.length > 0) {
            const fotosUrls = tryParseJson<string[]>(receita.image_source) || []
            for (const url of fotosUrls) {
                const fileName: string | undefined = url
                    .split(`/${FOLDER_NAME}/`)
                    .pop()
                if (fileName) {
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove([`${FOLDER_NAME}/${fileName}`])
                }
            }
            for (const file of files) {
                const fileName = `${randomUUID()}-${Date.now()}`
                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(`${FOLDER_NAME}/${fileName}`, file.buffer, {
                        contentType: file.mimetype,
                    })

                if (uploadError) {
                    throw uploadError
                }

                const {
                    data: { publicUrl },
                } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(`${FOLDER_NAME}/${fileName}`)

                if (!publicUrl) {
                    throw new StorageError(
                        'Erro ao obter URL pública da imagem',
                    )
                }
                imageUrls.push(publicUrl)
            }
        }
        // Remove todos os ingredientes antigos antes de adicionar os novos
        if (ingredientes) {
            await receitaRepository.update(id, {
                ingredientes: {
                    deleteMany: {}, // Deleta todos os ingredientes associados à receita
                },
            })
        }
        const receitaAtualizada = await receitaRepository.update(id, {
            titulo: titulo || receita.titulo,
            conteudo: conteudo || receita.conteudo,
            image_source: JSON.stringify(imageUrls),
            ingredientes: {
                create: ingredientes?.map((ingrediente) => ({
                    nome: ingrediente.nome,
                    quantidade: ingrediente.quantidade,
                    medida: ingrediente.medida,
                })),
            },
        })
        const { image_source, ...propsOfReceita } = receitaAtualizada
        res.status(200).json({
            receitas: {
                ...propsOfReceita,
                fotos: tryParseJson<string[]>(image_source) || [],
            },
        })
        return
    } catch (error) {
        if (error instanceof StorageError) {
            for (const url of imageUrls) {
                const fileName: string | undefined = url
                    .split(`/${FOLDER_NAME}/`)
                    .pop()
                if (fileName) {
                    await supabase.storage
                        .from(BUCKET_NAME)
                        .remove([`${FOLDER_NAME}/${fileName}`])
                }
            }
            console.error(error)
            res.status(500).json({
                error: 'Erro ao fazer upload das imagens',
            })
            return
        }
        next(error)
    }
}

export const deletar: RequestHandler = async (req, res, next) => {
    try {
        const receitaRepository = new PrismaReceitaRepository()

        const { id } = req.params

        const receita = await receitaRepository.findById(id)

        if (!receita) {
            res.status(404).json({
                error: 'Receita não encontrada',
            })
            return
        }

        await receitaRepository.delete(id)

        res.json({
            message: 'Receita deletada com sucesso',
        })
        return
    } catch (error) {
        next(error)
    }
}

const verifyBySchema = z.object({
    email: z
        .string({
            required_error: 'O parâmetro email é obrigatório',
            invalid_type_error: 'O parâmetro email deve ser uma string',
        })
        .email({
            message: 'O parâmetro email deve ser um email válido',
        }),
})
export const verify: RequestHandler = async (req, res, next) => {
    try {
        const receitaRepository = new PrismaReceitaRepository()
        const userRepository = new PrismaUsuarioRepository()
        const { id } = req.params
        const { email } = verifyBySchema.parse(req.body)

        const users = await userRepository.findByEmail({ email })

        if (!users) {
            res.status(404).json({
                error: `O usuário com o email ${email} não foi encontrado.`,
            })
            return
        }

        if (!users.is_monitor) {
            res.status(400).json({
                error: `O usuário com o email ${email} não é um monitor.`,
            })
            return
        }

        const receitaAtualizada = await receitaRepository.update(id, {
            is_verify: true,
            verify_by: email,
            data_alteracao: new Date(),
        })

        if (!receitaAtualizada) {
            res.status(404).json({
                error: 'Receita não encontrada',
            })
            return
        }

        res.json({
            message: 'Receita verificada com sucesso',
            data: receitaAtualizada,
        })
        return
    } catch (error) {
        next(error)
    }
}

export const getAllVerifiedByTheme: RequestHandler = async (req, res, next) => {
    try {
        const { tema } = req.params
        const receitaRepository = new PrismaReceitaRepository()

        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(400).json({
                error: `O tema ${tema} não é um tema válido.`,
            })
            return
        }

        const receitas = await receitaRepository.findAllVerifiedByTheme(tema)

        if (!receitas.length) {
            res.status(404).json({
                error: 'Nenhuma receita encontrada',
            })
            return
        }

        const receitaComDetalhes = receitas.map((receita) => {
            // Depois, analisar para ver se está tudo certo
            const subtemasSet = new Set(
                receita.receitas_subtemas.map((rel) => rel.subtema_id),
            )

            return {
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                idUsuario: receita.usuario_id,
                verifyBy: receita.verify_by,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                tema: tema,
                subtemas: Array.from(subtemasSet),
                fotos: receita.image_source ? [receita.image_source] : [],
            }
        })
        res.status(200).json({ receitas: receitaComDetalhes })
    } catch (error) {
        next(error)
    }
}

export const getAllNotVerifiedByTheme: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const { tema } = req.params
        const receitaRepository = new PrismaReceitaRepository()

        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })

        if (!temaExists) {
            res.status(400).json({
                error: `O tema ${tema} não é um tema válido.`,
            })
            return
        }

        const receitas = await receitaRepository.findAllNotVerifiedByTheme(tema)

        if (!receitas.length) {
            res.status(404).json({
                error: 'Nenhuma receita encontrada',
            })
            return
        }

        const receitaComDetalhes = receitas.map((receita) => {
            // Depois, analisar para ver se isso está funcionando
            const subtemasSet = new Set(
                receita.receitas_subtemas.map((rel) => rel.subtema_id),
            )

            return {
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                idUsuario: receita.usuario_id,
                verifyBy: receita.verify_by,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                tema: tema,
                subtemas: Array.from(subtemasSet),
                fotos: receita.image_source ? [receita.image_source] : [],
            }
        })

        res.json({ receitas: receitaComDetalhes })
    } catch (error) {
        next(error)
    }
}

export const getAllByTheme: RequestHandler = async (req, res, next) => {
    try {
        const { tema } = req.params
        const receitaRepository = new PrismaReceitaRepository()

        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(400).json({
                error: `O tema ${tema} não é um tema válido.`,
            })
            return
        }

        const receitas = await receitaRepository.findAllByTheme(tema)

        if (!receitas.length) {
            res.status(404).json({
                error: 'Nenhuma receita encontrada',
            })
            return
        }

        const receitaComDetalhes = receitas.map((receita) => {
            // Depois, analisar para ver se isso está funcionando
            const subtemasSet = new Set(
                receita.receitas_subtemas.map((rel) => rel.subtema_id),
            )

            return {
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                idUsuario: receita.usuario_id,
                verifyBy: receita.verify_by,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                tema: tema,
                subtemas: Array.from(subtemasSet),
                fotos: receita.image_source ? [receita.image_source] : [],
            }
        })

        res.json({ receitas: receitaComDetalhes })
    } catch (error) {
        next(error)
    }
}

export const getReceitasPorSubtemas: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const { tema } = req.params
        const subtema = req.params.subtema.split(',')
        const receitaRepository = new PrismaReceitaRepository()

        const receitas = await receitaRepository.getReceitasPorSubtemas(
            tema,
            subtema,
        )

        const formatadas = receitas.map((receita) => {
            // Depois, analisar para ver se está tudo certo
            const subtemasSet = new Set(
                receita.receitas_subtemas.map((rel) => rel.subtema_id),
            )

            return {
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                idUsuario: receita.usuario_id,
                verifyBy: receita.verify_by,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                subtemas: Array.from(subtemasSet),
                fotos: receita.image_source ? [receita.image_source] : [],
            }
        })
        if (formatadas.length === 0) {
            res.status(404).json({
                error: 'Nenhuma receita encontrada para os subtemas especificados',
            })
            return
        }
        res.status(200).json({ receitas: formatadas })
        return
    } catch (error) {
        next(error)
    }
}
