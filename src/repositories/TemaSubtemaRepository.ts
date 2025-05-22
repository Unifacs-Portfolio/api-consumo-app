import { Prisma, temasubtema } from "../../generated/prisma";

export interface TemaSubtemaRepository {
    create({id, subtema, tema}: Prisma.temasubtemaUncheckedCreateInput): Promise<temasubtema>;
    findByTemaAndSubtema({ tema, subtema }: { tema?: NonNullable<temasubtema['tema']>; subtema?: NonNullable<temasubtema['subtema']> }): Promise<temasubtema[]>;
    getSubtemasByTema({ tema }: { tema: NonNullable<temasubtema['tema']> }): Promise<temasubtema[]>;
}
