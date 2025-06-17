import type { RequestHandler } from 'express'
import { z } from 'zod'
import { PrismaQuizRepository } from '../repositories/prisma/PrismaQuizRepository'

const quizRepository = new PrismaQuizRepository()

const storeSchema = z.object({
    pergunta: z.string().min(1, 'A pergunta é obrigatória'),
    resposta_verdadeira: z.string().min(1, 'A resposta verdadeira é obrigatória'),
    ordem: z.number({
        invalid_type_error: 'A ordem deve ser um número',
        required_error: 'A ordem é obrigatória',
    }).min(1, 'A ordem deve ser maior que 0'),
    app: z.string().min(1, 'O app é obrigatório'),
    titulo: z.string().min(1, 'O título é obrigatório'),
    descricao: z.string().min(1, 'A descrição é obrigatória'),
})

export const store: RequestHandler = async (req, res, next) => {
    try {
        const quizData = storeSchema.parse(req.body)
        const quiz = await quizRepository.create(quizData)

        res.status(201).json({
            message: 'Quiz criado com sucesso',
            data: quiz
        })
    } catch (error) {
        next(error)
    }
}

export const index: RequestHandler = async (_req, res, next) => {
    try {
        const quizes = await quizRepository.findAll()
        res.status(200).json(quizes)
    } catch (error) {
        next(error)
    }
}

export const show: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const quiz = await quizRepository.findById(id)

        if (!quiz) {
            res.status(404).json({
                message: `O quiz com o Id ${id} não foi encontrado.`
            })
            return
        }

        res.status(200).json(quiz)
    } catch (error) {
        next(error)
    }
}

const updateSchema = z.object({
    pergunta: z.string().min(1, 'A pergunta é obrigatória'),
    resposta_verdadeira: z.string().min(1, 'A resposta verdadeira é obrigatória'),
    ordem: z.number({
        invalid_type_error: 'A ordem deve ser um número',
        required_error: 'A ordem é obrigatória',
    }).min(1, 'A ordem deve ser maior que 0'),
    app: z.string().min(1, 'O app é obrigatório'),
    titulo: z.string().min(1, 'O título é obrigatório'),
    descricao: z.string().min(1, 'A descrição é obrigatória'),
})

export const update: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const quizData = updateSchema.parse(req.body)

        const existingQuiz = await quizRepository.findById(id)

        if (!existingQuiz) {
            res.status(404).json({
                message: `O quiz com o Id ${id} não foi encontrado.`
            })
            return
        }

        const updatedQuiz = await quizRepository.update(id, quizData)

        res.status(200).json({
            message: 'Quiz atualizado com sucesso',
            data: updatedQuiz
        })
    } catch (error) {
        next(error)
    }
}

export const destroy: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params
        const quiz = await quizRepository.findById(id)

        if (!quiz) {
            res.status(404).json({
                message: `O quiz com o Id ${id} não foi encontrado.`
            })
            return
        }

        await quizRepository.delete(id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export const validateAnswer: RequestHandler = async (req, res, next) => {   
    try {
        const { id } = req.params
        const { resposta } = req.body

        const quiz = await quizRepository.findById(id)

        if (!quiz) {
            res.status(404).json({
                message: `O quiz com o Id ${id} não foi encontrado.`
            })
            return
        }

        // Função para normalizar as strings antes da comparação
        const normalizeAnswer = (str: string) => 
            str
                .normalize('NFD')                      // Normaliza caracteres acentuados
                .replace(/\s+/g, ' ')                  // Converte múltiplos espaços em um só
                .replace(/[.,;:!?]$/g, '')             // Remove pontuação final comum
                .trim()
                .toLowerCase()

        
        const opcoes = quiz.descricao.split('\n').map(opcao => opcao.trim())

        
        const respostaNum = Number(resposta)

        if (
            !Number.isInteger(respostaNum) ||
            respostaNum < 1 ||
            respostaNum > opcoes.length
        ) {
            res.status(400).json({
                message: `Resposta inválida. Por favor, envie um número entre 1 e ${opcoes.length}`,
                opcoes: opcoes.map((op, i) => ({ numero: i + 1, texto: op }))
            })
            return
        }

        const respostaEscolhida = opcoes[respostaNum - 1]

        const isCorrect = normalizeAnswer(respostaEscolhida) === normalizeAnswer(quiz.resposta_verdadeira)

        res.status(200).json({
            message: isCorrect ? 'Resposta correta!' : 'Resposta incorreta.',
            correctAnswer: quiz.resposta_verdadeira,
            isCorrect
        })
    } catch (error) {
        next(error)
    }
}
