import type { QuizRepository } from "../QuizRepository"
import type { quizes, Prisma, PrismaClient } from '../../../generated/prisma'
import { prisma } from '../../db'

export class PrismaQuizRepository implements QuizRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async create(quiz: Prisma.quizesUncheckedCreateInput): Promise<quizes> {
        return this.prisma.quizes.create({
            data: quiz
        })
    }

    async update(id: quizes['id'], quiz: Prisma.quizesUncheckedUpdateInput): Promise<quizes> {
        return this.prisma.quizes.update({
            where: { id },
            data: quiz
        })
    }

    async delete(id: quizes['id']): Promise<void> {
        await this.prisma.quizes.delete({
            where: { id }
        })
    }

    async findById(id: quizes['id']): Promise<quizes | null> {
        return this.prisma.quizes.findUnique({
            where: { id }
        })
    }

    async findAll(): Promise<quizes[]> {
        return this.prisma.quizes.findMany({
            orderBy: {
                ordem: 'asc'
            }
        })
    }
}