import type { quizes, Prisma } from '../../generated/prisma'

export interface QuizRepository {
    create(
        quiz: Prisma.quizesUncheckedCreateInput,
    ): Promise<quizes>
    update(
        id: quizes['id'],
        quiz: Prisma.quizesUncheckedUpdateInput,
    ): Promise<quizes>
    delete(id: quizes['id']): Promise<void>
    findById(id: quizes['id']): Promise<quizes | null>
    findAll(): Promise<quizes[]>
}
