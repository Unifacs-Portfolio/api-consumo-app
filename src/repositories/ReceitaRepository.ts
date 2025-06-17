import type { receitas, Prisma } from '../../generated/prisma'

export interface ReceitaRepository {
    create(receita: Prisma.receitasUncheckedCreateInput): Promise<receitas>
    update(
        id: string,
        receita: Prisma.receitasUncheckedUpdateInput,
    ): Promise<receitas>
    delete(id: string): Promise<void>
    findById(id: string): Promise<receitas | null>
    findAll(): Promise<
        Prisma.receitasGetPayload<{
            include: {
                receitas_subtemas: true
                ingredientes: true
            }
        }>[]
    >
    findAllByTheme(tema: string): Promise<
        Prisma.receitasGetPayload<{
            include: {
                receitas_subtemas: true
                ingredientes: true
            }
        }>[]
    >
    findAllVerifiedByTheme(tema: string): Promise<
        Prisma.receitasGetPayload<{
            include: {
                receitas_subtemas: true
                ingredientes: true
            }
        }>[]
    >
    findAllNotVerifiedByTheme(tema: string): Promise<
        Prisma.receitasGetPayload<{
            include: {
                receitas_subtemas: true
                ingredientes: true
            }
        }>[]
    >
    verify(id: string, verifyBy: string): Promise<receitas>
    getAllDetails(): Promise<
        Prisma.receitasGetPayload<{
            include: {
                tema: true
                receitas_subtemas: {
                    include: {
                        subtema: true
                    }
                }
            }
        }>[]
    >
}
