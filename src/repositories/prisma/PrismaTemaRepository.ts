import { PrismaClient, tema, temasubtema } from "../../../generated/prisma/client";
import { TemaRepository } from "../TemaRepository";

export class PrismaTemaRepository implements TemaRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll() {
        return this.prisma.tema.findMany();
    }

    async findById({ id }: Pick<tema, 'id'>) {
        return this.prisma.tema.findUnique({
            where: { id },
        });
    }

    async delete({ id }: Pick<tema, 'id'>) {
        await this.prisma.tema.delete({
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
