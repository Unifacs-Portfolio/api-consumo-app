import { dicas, dicas_subtemas, Prisma } from "../../generated/prisma";

export interface DicaRepository {
    findById(id: dicas['id']): Promise<dicas | null>;
    create(data: Prisma.dicasUncheckedCreateInput): Promise<dicas>;
    update(id: dicas['id'], dica: Prisma.dicasUncheckedUpdateInput): Promise<dicas>;
    findAllWithCorrelacaoOrderById(): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>;
    delete(id: dicas['id']): Promise<void>;
    findAllByIsVerify(isVerify: dicas['is_verify']): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>;
    findAllCreatedBySpecialist(
        specialistId: dicas['is_created_by_specialist']
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]>;
}