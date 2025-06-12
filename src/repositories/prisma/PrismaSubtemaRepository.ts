import {
    type Prisma,
    PrismaClient,
    type subtemas,
} from '../../../generated/prisma'
import type { SubtemaRepository } from '../SubtemaRepository'

export class PrismaSubtemaRepository implements SubtemaRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }
    findByName({ nome }: Pick<subtemas, 'nome'>): Promise<subtemas | null> {
        return this.prisma.subtemas.findFirst({
            where: {
                nome,
            },
        })
    }

    findByTemaId({ tema_id }: Pick<subtemas, 'tema_id'>): Promise<subtemas[]> {
        return this.prisma.subtemas.findMany({
            where: {
                tema_id,
            },
        })
    }

    async findByDescription(descricao: string): Promise<subtemas | null> {
        return await this.prisma.subtemas.findFirst({
            where: {
                descricao,
            },
        })
    }

    async create(
        subtema: Prisma.subtemasUncheckedCreateInput,
    ): Promise<subtemas> {
        return await this.prisma.subtemas.create({
            data: subtema,
        })
    }

    async findById(id: string): Promise<subtemas | null> {
        return await this.prisma.subtemas.findUnique({
            where: { id },
        })
    }

    async findAll(): Promise<subtemas[]> {
        return await this.prisma.subtemas.findMany()
    }

    async update(
        id: string,
        subtema: Prisma.subtemasUncheckedUpdateInput,
    ): Promise<subtemas | null> {
        return await this.prisma.subtemas.update({
            where: { id },
            data: subtema,
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.subtemas.delete({
            where: { id },
        })
    }
}
