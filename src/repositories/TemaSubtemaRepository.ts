import { Prisma, temas_subtemas } from "../../generated/prisma";

export interface TemaSubtemaRepository {
    create({tema_id, subtema_id}: Prisma.temas_subtemasUncheckedCreateInput): Promise<temas_subtemas>;
    findByTemaAndSubtema({ temaId, subtemaId }: { temaId?: NonNullable<temas_subtemas['tema_id']>; subtemaId?: NonNullable<temas_subtemas['subtema_id']> }): Promise<temas_subtemas[]>;
    getSubtemasByTema({ temaId }: { temaId: NonNullable<temas_subtemas['tema_id']> }): Promise<temas_subtemas[]>;
}
