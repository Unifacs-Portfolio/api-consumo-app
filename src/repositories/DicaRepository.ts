import { dicas, correlacaodicas, Prisma } from "../../generated/prisma";

export interface DicaRepository {
    create(dica: Prisma.dicasUncheckedCreateInput): Promise<dicas>;
    update(dica: Prisma.dicasUncheckedUpdateInput): Promise<dicas>;
    findAllWithCorrelacaoOrderById(): Promise<(dicas & { correlacaoDicas: correlacaodicas[] })[]>;
}