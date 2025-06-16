import type { Prisma, receitas_subtemas } from '../../generated/prisma'

export interface ReceitaSubtemaRepository {
    delete(receita_id: string, subtema_id: string): Promise<void>
    create(
        receita_subtema: Prisma.receitas_subtemasUncheckedCreateInput,
    ): Promise<receitas_subtemas>
    findAll(): Promise<receitas_subtemas[]>
    findById(
        receita_id: string,
        subtema_id: string,
    ): Promise<receitas_subtemas | null>
    update(
        receita_id: string,
        subtema_id: string,
        receita_subtema: Prisma.receitas_subtemasUncheckedCreateInput,
    ): Promise<receitas_subtemas | null>
}
