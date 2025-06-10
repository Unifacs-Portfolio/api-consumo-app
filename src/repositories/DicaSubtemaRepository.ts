import { Prisma, dicas_subtemas } from "../../generated/prisma";

export interface DicaSubtemaRepository {
    create(data: Prisma.dicas_subtemasUncheckedCreateInput): Promise<dicas_subtemas>;
    findByDicaId(dicaId: dicas_subtemas['dica_id']): Promise<dicas_subtemas[]>;
    deleteMany(dicaId: dicas_subtemas['dica_id']): Promise<void>;
}