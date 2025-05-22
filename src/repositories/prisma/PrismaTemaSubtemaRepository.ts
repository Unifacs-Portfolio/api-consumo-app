import { Prisma, temasubtema } from "../../../generated/prisma";
import { TemaSubtemaRepository } from "../TemaSubtemaRepository";
import { PrismaClient } from "../../../generated/prisma/client";

export class PrismaTemaSubtemaRepository implements TemaSubtemaRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async create({ id, subtema, tema }: Prisma.temasubtemaUncheckedCreateInput) {
        return this.prisma.temasubtema.create({
            data: {
                id,
                subtema,
                tema
            }
        });
    }

    async findByTemaAndSubtema({ tema, subtema }: { tema?: NonNullable<temasubtema['tema']>; subtema?: NonNullable<temasubtema['subtema']> }) {
        return this.prisma.temasubtema.findMany({
            where: {
                tema,
                subtema
            }
        });
    }

    async getSubtemasByTema({ tema }: { tema: NonNullable<temasubtema['tema']> }) {
        return this.prisma.temasubtema.findMany({
            where: { tema }
        });
    }
}

export default new PrismaTemaSubtemaRepository();