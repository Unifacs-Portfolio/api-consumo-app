import type { RequestHandler } from 'express'
import { PrismaDicaRepository } from '../repositories/prisma/PrismaDicaRepository'
import { PrismaDicaSubtemaRepository } from '../repositories/prisma/PrismaDicaSubtemaRepository'
import { PrismaSubtemaRepository } from '../repositories/prisma/PrismaSubtemaRepository'
import { PrismaTemaRepository } from '../repositories/prisma/PrismaTemaRepository'
import { PrismaUsuarioRepository } from '../repositories/prisma/PrismaUsuarioRepository'
import { z } from 'zod'
import { prisma } from '../db'

const createBodySchema = z.object({
    email: z
        .string({
            required_error: 'O campo email é obrigatório.',
            invalid_type_error: 'O campo email deve ser uma string.',
        })
        .min(1, {
            message: 'O campo email não pode estar vazio.',
        })
        .email({
            message: 'O campo email deve ser um email válido.',
        }),
    conteudo: z
        .string({
            required_error: 'O campo conteudo é obrigatório.',
            invalid_type_error: 'O campo conteudo deve ser uma string.',
        })
        .min(3, {
            message: 'O campo conteudo deve ter pelo menos 3 caracteres.',
        })
        .max(1000, {
            message: 'O campo conteudo deve ter no máximo 1000 caracteres.',
        }),
    titulo: z
        .string({
            required_error: 'O campo titulo é obrigatório.',
            invalid_type_error: 'O campo titulo deve ser uma string.',
        })
        .min(3, {
            message: 'O campo titulo deve ter pelo menos 3 caracteres.',
        })
        .max(100, {
            message: 'O campo titulo deve ter no máximo 100 caracteres.',
        }),
    tema: z
        .string({
            required_error: 'O campo tema é obrigatório.',
            invalid_type_error: 'O campo tema deve ser uma string.',
        })
        .min(1, {
            message: 'O campo tema não pode estar vazio.',
        }),
    subtemas: z.array(
        z
            .string({
                required_error: 'O campo subtemas é obrigatório.',
                invalid_type_error:
                    'O campo subtemas deve ser um array de strings.',
            })
            .min(1, {
                message: 'O campo subtemas deve ter pelo menos 1 subtema.',
            })
            .max(100, {
                message: 'O campo subtemas deve ter no máximo 100 subtemas.',
            })
            .min(1)
            .max(100),
        {
            required_error: 'O campo subtemas é obrigatório.',
            invalid_type_error:
                'O campo subtemas deve ser um array de strings.',
        },
    ),
})

export const create: RequestHandler = async (req, res, next) => {
    try {
        const { email, conteudo, titulo, tema, subtemas } =
            createBodySchema.parse(req.body)
        const usuarioRepository = new PrismaUsuarioRepository()
        const user = await usuarioRepository.findByEmail({ email })
        if (!user) {
            res.status(404).json({
                message: `O usuário com o email ${email} não existe.`,
            })
            return
        }
        const isCreatedBySpecialist = user.is_monitor

        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemas_id: string[] = []
        for (const subtema of subtemas) {
            const subtemaExists = await subtemaRepository.findByName({
                nome: subtema,
            })
            if (!subtemaExists) {
                const subtemaCriado = await subtemaRepository.create({
                    tema_id: temaExists.id,
                    nome: subtema,
                    descricao: '',
                })
                subtemas_id.push(subtemaCriado.id)
                continue
            }
            if (subtemaExists.tema_id !== temaExists.id) {
                res.status(400).json({
                    message: `O subtema ${subtema} não pertence ao tema ${tema}.`,
                })
                return
            }
            subtemas_id.push(subtemaExists.id)
        }

        const dicaRepository = new PrismaDicaRepository()
        const dicaData = await dicaRepository.create({
            tema_id: temaExists.id,
            usuario_id: user.id,
            conteudo,
            titulo,
            is_verify: false,
            verify_by: null,
            is_created_by_specialist: isCreatedBySpecialist,
            dicas_subtemas: {
                createMany: {
                    data: subtemas_id.map((id) => {
                        return {
                            subtema_id: id,
                            assunto: '',
                        }
                    }),
                },
            },
        })

        res.status(201).json({
            dica: dicaData,
        })
        return
    } catch (error) {
        next(error)
    }
}

export const getAll: RequestHandler = async (_req, res, next) => {
    try {
        const dicasRepository = new PrismaDicaRepository()
        const dicas = await dicasRepository.findAllWithCorrelacaoOrderById()
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                const temaRepository = new PrismaTemaRepository()
                const tema = await temaRepository.findById({ id: dica.tema_id })
                if (!tema) {
                    throw new Error(
                        `Tema com ID ${dica.tema_id} não encontrado.`,
                    )
                }
                const subtemaRepository = new PrismaSubtemaRepository()
                const subtemas = await subtemaRepository.findByTemaId({
                    tema_id: tema.id,
                })
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    usuarioId: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: tema.nome,
                    subtemas: subtemas.map((subtema) => subtema.nome),
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )

        res.json({ dicas: dicasComDetalhes })
        return
    } catch (error) {
        next(error)
    }
}

const getByCodeSchema = z.object({
    id: z
        .string({
            required_error: 'ID é obrigatório',
            invalid_type_error: 'ID deve ser um UUID válido',
        })
        .uuid('ID deve ser um UUID válido'),
})
export const getByCode: RequestHandler = async (req, res, next) => {
    try {
        const { id } = getByCodeSchema.parse(req.params)
        const dicaRepository = new PrismaDicaRepository()
        const dica = await dicaRepository.findById(id)
        if (!dica) {
            res.status(404).json({
                message: `Dica com o código ${id} não encontrada.`,
            })
            return
        }
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemas = await subtemaRepository.findByTemaId({
            tema_id: dica.tema_id,
        })
        const temaRepository = new PrismaTemaRepository()
        const tema = await temaRepository.findById({ id: dica.tema_id })
        if (!tema) {
            res.status(404).json({
                message: `Tema com o ID ${dica.tema_id} não encontrado.`,
            })
            return
        }
        res.json({
            id: dica.id,
            titulo: dica.titulo,
            conteudo: dica.conteudo,
            isVerify: dica.is_verify,
            usuarioId: dica.usuario_id,
            verifyBy: dica.verify_by,
            createdAt: dica.data_criacao,
            updatedAt: dica.data_alteracao,
            tema: tema.nome,
            subtemas: subtemas.map((subtema) => subtema.nome),
        })
    } catch (error) {
        next(error)
    }
}

const updateBodySchema = z.object({
    conteudo: z.string().min(10).max(1000),
    titulo: z.string().min(3).max(500),
    tema: z.string().min(1),
    subtemas: z.array(z.string().min(1)).min(1),
})
const updateParamsSchema = z.object({
    id: z.string().uuid('ID deve ser um UUID válido'),
})
export const update: RequestHandler = async (req, res, next) => {
    try {
        const { conteudo, titulo, tema, subtemas } = updateBodySchema.parse(
            req.body,
        )
        const { id } = updateParamsSchema.parse(req.params)

        const dicaRepository = new PrismaDicaRepository()
        const dicaExists = await dicaRepository.findById(id)
        if (!dicaExists) {
            res.status(404).json({
                message: `Dica com o código ${id} não encontrada.`,
            })
            return
        }
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const dicaAtualizada = await prisma.$transaction(async () => {
            const subtemaRepository = new PrismaSubtemaRepository()
            const subtemas_id: string[] = []
            for (const subtema of subtemas) {
                const subtemaData = await subtemaRepository.findByTemaIdAndName(
                    temaExists.id,
                    subtema,
                )
                if (!subtemaData) {
                    const createdSubtema = await subtemaRepository.create({
                        tema_id: temaExists.id,
                        nome: subtema,
                        descricao: '',
                    })
                    subtemas_id.push(createdSubtema.id)
                } else {
                    subtemas_id.push(subtemaData.id)
                }
            }
            return await dicaRepository.update(dicaExists.id, {
                conteudo,
                titulo,
                tema_id: temaExists.id,
                dicas_subtemas: {
                    deleteMany: {
                        dica_id: dicaExists.id,
                    },
                    createMany: {
                        data: subtemas_id.map((subtema_id) => ({
                            subtema_id,
                            assunto: '',
                        })),
                    },
                },
            })
        })

        res.status(200).json({
            dica: dicaAtualizada,
        })
        return
    } catch (error) {
        next(error)
    }
}

const deleteParamsSchema = z.object({
    id: z.string().uuid('ID deve ser um UUID válido'),
})
export const deletar: RequestHandler = async (req, res, next) => {
    try {
        const { id } = deleteParamsSchema.parse(req.params)
        const dicaSubtemaRepository = new PrismaDicaSubtemaRepository()
        const dicaRepository = new PrismaDicaRepository()
        const dicaExists = await dicaSubtemaRepository.findByDicaId(id)
        if (!dicaExists) {
            res.status(404).json({
                message: `Dica com o código ${id} não encontrada.`,
            })
            return
        }
        await dicaSubtemaRepository.deleteMany(id)
        await dicaRepository.delete(id)
        res.status(204).end()
        return
    } catch (error) {
        next(error)
    }
}

const verifyBodySchema = z.object({
    verifyBy: z.string().email('Email inválido'),
})
const verifyParamsSchema = z.object({
    id: z.string().uuid('ID deve ser um UUID válido'),
})
export const verify: RequestHandler = async (req, res, next) => {
    try {
        const { verifyBy } = verifyBodySchema.parse(req.body)
        const { id } = verifyParamsSchema.parse(req.params)

        const usuarioRepository = new PrismaUsuarioRepository()
        const isMonitor = await usuarioRepository.getMonitorStatusByEmail({
            email: verifyBy,
        })
        if (isMonitor === null) {
            res.status(404).json({
                message: `O usuário com o email ${verifyBy} não foi encontrado.`,
            })
            return
        }
        if (!isMonitor) {
            res.status(403).json({
                message: `O usuário com o email ${verifyBy} não tem permissão para verificar dicas.`,
            })
            return
        }

        const dicaRepository = new PrismaDicaRepository()
        const dica = await dicaRepository.findById(id)
        if (!dica) {
            res.status(404).json({
                message: `A dica com o código ${id} não foi encontrada.`,
            })
            return
        }
        const dicaUpdated = await dicaRepository.update(id, {
            is_verify: true,
            verify_by: verifyBy,
        })
        res.status(200).json({
            dica: {
                id: dicaUpdated.id,
                isVerify: dicaUpdated.is_verify,
                verifyBy: dicaUpdated.verify_by,
            },
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllVerifiedByThemeParamsSchema = z.object({
    tema: z.string().min(1),
})
export const getAllVerifiedByTheme: RequestHandler = async (req, res, next) => {
    try {
        const { tema } = getAllVerifiedByThemeParamsSchema.parse(req.params)
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({
            nome: tema,
        })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const dicaRepository = new PrismaDicaRepository()
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemas = (
            await subtemaRepository.findByTemaId({ tema_id: temaExists.id })
        ).map((subtema) => subtema.nome)
        const dicas = (await dicaRepository.findAllByIsVerify(true)).filter(
            (dica) => dica.tema_id === temaExists.id,
        )
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    usuarioId: dica.usuario_id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: temaExists.nome,
                    subtemas,
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )
        res.status(200).json({
            dicas: dicasComDetalhes,
        })
        return
    } catch (error) {
        next(error)
    }
}

const getAllNotVerifiedByThemeParamsSchema = z.object({
    tema: z.string().min(1),
})
export const getAllNotVerifiedByTheme: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const { tema } = getAllNotVerifiedByThemeParamsSchema.parse(req.params)
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const dicaRepository = new PrismaDicaRepository()
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemas = (
            await subtemaRepository.findByTemaId({ tema_id: temaExists.id })
        ).map((subtema) => subtema.nome)
        const dicas = (await dicaRepository.findAllByIsVerify(false)).filter(
            (dica) => dica.tema_id === temaExists.id,
        )
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    usuarioId: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: temaExists.nome,
                    subtemas,
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )
        res.status(200).json({ dicas: dicasComDetalhes })
    } catch (error) {
        next(error)
    }
}

const getAllByThemeParamsSchema = z.object({
    tema: z.string().min(1),
})
export const getAllByTheme: RequestHandler = async (req, res, next) => {
    try {
        const { tema } = getAllByThemeParamsSchema.parse(req.params)
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const dicaRepository = new PrismaDicaRepository()
        const subtemaRepository = new PrismaSubtemaRepository()
        const dicas = (
            await dicaRepository.findAllWithCorrelacaoOrderById()
        ).filter((dica) => dica.tema_id === temaExists.id)
        const subtemas = (
            await subtemaRepository.findByTemaId({ tema_id: temaExists.id })
        ).map((subtema) => subtema.nome)
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    usuarioId: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: temaExists.nome,
                    subtemas,
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )
        res.json({ dicas: dicasComDetalhes })
        return
    } catch (error) {
        next(error)
    }
}

const getDicaByTemaAndSubtemaParamsSchema = z.object({
    tema: z
        .string({
            required_error: 'O campo tema é obrigatório.',
            invalid_type_error: 'O campo tema deve ser uma string.',
        })
        .min(1, {
            message: 'O campo tema não pode estar vazio.',
        }),
    subtema: z.string({
        required_error: 'O campo subtema é obrigatório.',
        invalid_type_error: 'O campo subtema deve ser uma string.',
    }),
})
export const getDicaByTemaAndSubtema: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const { tema, subtema } = getDicaByTemaAndSubtemaParamsSchema.parse(
            req.params,
        )
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemaExists = await subtemaRepository.findByName({
            nome: subtema,
        })
        if (!subtemaExists) {
            res.status(404).json({
                message: `O subtema ${subtema} não existe.`,
            })
            return
        }
        const dicaRepository = new PrismaDicaRepository()
        const dicas = await dicaRepository.findAllByThemeAndSubtema(
            temaExists.id,
            subtemaExists.id,
        )
        const subtemas = (
            await subtemaRepository.findByTemaId({ tema_id: temaExists.id })
        ).map((subtema) => subtema.nome)
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    usuarioId: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: temaExists.nome,
                    subtemas,
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )

        res.status(200).json({ dicas: dicasComDetalhes })
        return
    } catch (error) {
        next(error)
    }
}

const getSpecialistsDicaParamsSchema = z.object({
    tema: z
        .string({
            required_error: 'O campo tema é obrigatório.',
            invalid_type_error: 'O campo tema deve ser uma string.',
        })
        .min(1, {
            message: 'O campo tema não pode estar vazio.',
        }),
})
export const getSpecialistsDica: RequestHandler = async (req, res, next) => {
    try {
        const { tema } = getSpecialistsDicaParamsSchema.parse(req.params)
        const temaRepository = new PrismaTemaRepository()
        const temaExists = await temaRepository.findByName({ nome: tema })
        if (!temaExists) {
            res.status(404).json({
                message: `O tema ${tema} não existe.`,
            })
            return
        }
        const dicaRepository = new PrismaDicaRepository()
        const dicas = (
            await dicaRepository.findAllCreatedBySpecialist(true)
        ).filter((dica) => dica.tema_id === temaExists.id)
        const subtemaRepository = new PrismaSubtemaRepository()
        const subtemas = (
            await subtemaRepository.findByTemaId({ tema_id: temaExists.id })
        ).map((subtema) => subtema.nome)
        const dicasComDetalhes = await Promise.all(
            dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    usuarioId: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    createdAt: dica.data_criacao,
                    updatedAt: dica.data_alteracao,
                    tema: temaExists.nome,
                    subtemas,
                    isCreatedBySpecialist: dica.is_created_by_specialist,
                }
            }),
        )
        res.status(200).json({ dicas: dicasComDetalhes })
        return
    } catch (error) {
        next(error)
    }
}
