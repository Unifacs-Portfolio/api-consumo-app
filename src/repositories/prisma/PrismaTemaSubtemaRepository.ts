import { Prisma, temas_subtemas } from "../../../generated/prisma";
import { TemaSubtemaRepository } from "../TemaSubtemaRepository";
import { PrismaClient } from "../../../generated/prisma/client";

export class PrismaTemaSubtemaRepository implements TemaSubtemaRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async create({ tema_id, subtema_id }: Prisma.temas_subtemasUncheckedCreateInput) {
        return this.prisma.temas_subtemas.create({
            data: {
                tema_id,
                subtema_id
            }
        });
    }

    async findByTemaAndSubtema({ temaId, subtemaId }: { temaId?: NonNullable<temas_subtemas['tema_id']>; subtemaId?: NonNullable<temas_subtemas['subtema_id']> }) {
        return this.prisma.temas_subtemas.findMany({
            where: {
                tema_id: temaId,
                subtema_id: subtemaId
            }
        });
    }

    async getSubtemasByTema({ temaId }: { temaId: NonNullable<temas_subtemas['tema_id']> }) {
        return this.prisma.temas_subtemas.findMany({
            where: { tema_id: temaId }
        });
    }
}

export default new PrismaTemaSubtemaRepository();