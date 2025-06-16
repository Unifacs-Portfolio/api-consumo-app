import Ingrediente from '../models/Ingrediente'
import { PrismaIngredienteRepository } from '../repositories/prisma/PrismaIngredienteRepository'
import type { RequestHandler } from 'express'
import { z } from 'zod'

const storeSchema = z.object({
    nomeIngrediente: z.string().min(1, 'O nome do ingrediente é obrigatório'),
    quantidade: z.number({
        invalid_type_error: 'A quantidade deve ser um número',
        required_error: 'A quantidade é obrigatória',
    }).min(1, 'A quantidade deve ser maior que 0'),
    medida: z.string().min(1, 'A medida é obrigatória'),
    receitaId: z.string({
        invalid_type_error: 'O ID da receita deve ser uma string',
        required_error: 'O ID da receita é obrigatório',
    }).uuid('A receitaId deve ser um UUID válido'),
})

export const store: RequestHandler = async (req, res, next) => {
    try {
        const { nomeIngrediente, quantidade, medida, receitaId } = storeSchema.parse(req.body)

        const ingrediente = new Ingrediente({
            nomeIngrediente,
            quantidade,
            medida,
        })

        const { valid, errors } = ingrediente.validate()

        if (!valid) {
            res.status(400).json({
                message: 'Esse ingrediente não é válido',
                errors: errors,
            })
            return
        }

        const { data, error } = await ingrediente.save(receitaId)
        if (error) {
            throw error
        }
        res
            .status(201)
            .json({
                message: 'Ingrediente adicionado com sucesso',
                data: data,
            })
        return
    } catch (error) {
        next(error)
    }
}

export const index: RequestHandler = async (_req, res, next) => {
    try {
        const ingredienteRepository = new PrismaIngredienteRepository()
        const ingredientes = await ingredienteRepository.findAll()
        res.json(ingredientes)
        return
    } catch (error) {
        next(error)
    }
}

export const show: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const ingredienteRepository = new PrismaIngredienteRepository()
        const ingrediente = await ingredienteRepository.findById(id)
        if (!ingrediente) {
            res.status(404).json({
                message: `O ingrediente com o Id ${id} não foi encontrado.`,
            })
            return
        }
        res.json(ingrediente)
        return
    } catch (error) {
        next(error)
    }
}

const updateSchema = z.object({
    nomeIngrediente: z.string().min(1, 'O nome do ingrediente é obrigatório'),
    quantidade: z.number({
        invalid_type_error: 'A quantidade deve ser um número',
        required_error: 'A quantidade é obrigatória',
    }).min(1, 'A quantidade deve ser maior que 0'),
    medida: z.string().min(1, 'A medida é obrigatória')
})
export const update: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const { nomeIngrediente, quantidade, medida } = updateSchema.parse(req.body)

        const ingrediente = new Ingrediente({
            nomeIngrediente,
            quantidade,
            medida,
        })
        const { valid, errors } = ingrediente.validate()

        if (!valid) {
            res.status(400).json({
                message: 'Esse ingrediente não é válido',
                errors: errors,
            })
            return
        }
        const ingredienteRepository = new PrismaIngredienteRepository()
        const existingIngrediente = await ingredienteRepository.findById(id)
        if (!existingIngrediente) {
            res.status(404).json({
                message: `O ingrediente com o Id ${id} não foi encontrado.`,
            })
            return
        }
        const updatedIngrediente = await ingredienteRepository.update(
            id,
            {
                nome: ingrediente.nomeIngrediente,
                quantidade: ingrediente.quantidade.toString(),
                medida: ingrediente.medida,
            },
        )
        res
            .status(200)
            .json({
                message: 'Ingrediente atualizado com sucesso',
                ingrediente: updatedIngrediente,
            })
        return
    } catch (error) {
        next(error)
    }
}

export const deletar: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const ingredienteRepository = new PrismaIngredienteRepository()
        const ingrediente = await ingredienteRepository.findById(id)
        if (!ingrediente) {
            res.status(404).json({
                message: `O ingrediente com o Id ${id} não foi encontrado.`,
            })
            return
        }
        await ingredienteRepository.delete(id)
        res.status(204).end()
        return
    } catch (error) {
        next(error)
    }
}

