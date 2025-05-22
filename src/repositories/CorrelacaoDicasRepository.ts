import { Prisma, correlacaodicas} from "../../generated/prisma";

export interface CorrelacaoDicasRepository {
    create(correlacaoDicas: Prisma.correlacaodicasUncheckedCreateInput): Promise<correlacaodicas>;
    findByDicaId(dicaId: number): Promise<correlacaodicas[]>;
    delete(dicaId: number): Promise<void>;
}