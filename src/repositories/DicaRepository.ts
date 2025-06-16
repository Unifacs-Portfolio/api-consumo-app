import type { dicas, dicas_subtemas, Prisma } from '../../generated/prisma'

export interface DicaRepository {
    findById(id: string): Promise<dicas | null>
    create(data: Prisma.dicasUncheckedCreateInput): Promise<dicas>
    update(
        id: string,
        dica: Prisma.dicasUncheckedUpdateInput,
    ): Promise<
        Prisma.dicasGetPayload<{
            select: {
                id: true
                titulo: true
                conteudo: true
                is_verify: true
                verify_by: true
                is_created_by_specialist: true
            }
        }>
    >
    findAllWithCorrelacaoOrderById(): Promise<
        (dicas & { dicas_subtemas: dicas_subtemas[] })[]
    >
    delete(id: string): Promise<void>
    findAllByIsVerify(
        isVerify: dicas['is_verify'],
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>
    findAllCreatedBySpecialist(
        specialistId: dicas['is_created_by_specialist'],
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>
    findAllByThemeAndSubtema(
        temaId: string,
        subtemaId: string,
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>
}
