import { PrismaClient, temas, temas_subtemas } from "../../../generated/prisma/client";
import { TemaRepository } from "../TemaRepository";

export class PrismaTemaRepository implements TemaRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.temas.findMany();
    }

    async findById({ id }: Pick<temas, 'id'>) {
        return this.prisma.temas.findUnique({
            where: { id },
        });
    }

    async delete({ id }: Pick<temas, 'id'>) {
        await this.prisma.temas.delete({
            where: { id },
        });
    }

    /* async checkIfExists(id: number): Promise<boolean> {
        const count = await this.prisma.tema.count({
            where: { id },
        });
        return count > 0;
    } */
}
