import { Prisma, PrismaClient, dicas_subtemas } from "../../../generated/prisma";
import { DicaSubtemaRepository } from "../DicaSubtemaRepository";

export class PrismaDicaSubtemaRepository implements DicaSubtemaRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    findByDicaId(dicaId: string) {
        return this.prisma.dicas_subtemas.findMany({
            where: {
                dica_id: dicaId
            }
        });
    }
    async deleteMany(dicaId: string) {
        await this.prisma.dicas_subtemas.deleteMany({
            where: {
                dica_id: dicaId
            }
        });
    }

    create({ dica_id, subtema_id, assunto }: Prisma.dicas_subtemasUncheckedCreateInput) {
        return this.prisma.dicas_subtemas.create({
            data: {
                dica_id,
                subtema_id,
                assunto
            }
        });
    }

}