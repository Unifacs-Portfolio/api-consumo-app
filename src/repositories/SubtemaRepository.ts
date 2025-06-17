import type { Prisma, subtemas } from '../../generated/prisma'

export interface SubtemaRepository {
    create(subtema: Prisma.subtemasUncheckedCreateInput): Promise<subtemas>
    findById(id: string): Promise<subtemas | null>
    findByTemaId({ tema_id }: Pick<subtemas, 'tema_id'>): Promise<subtemas[]>
    findByTemaIdAndName(tema_id: string, nome: string): Promise<subtemas | null>
    findAll(): Promise<subtemas[]>
    update(
        id: string,
        subtema: Prisma.subtemasUncheckedUpdateInput,
    ): Promise<subtemas | null>
    delete(id: string): Promise<void>
    findByDescription(descricao: string): Promise<subtemas | null>
    findByName({ nome }: Pick<subtemas, 'nome'>): Promise<subtemas | null>
}
