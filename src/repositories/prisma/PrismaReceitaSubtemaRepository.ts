import type {
    Prisma,
    PrismaClient,
    receitas_subtemas,
} from '../../../generated/prisma'
import type { ReceitaSubtemaRepository } from '../ReceitaSubtemaRepository'
import { prisma } from '../../db'

export class PrismaReceitaSubtemaRepository
    implements ReceitaSubtemaRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async delete(receita_id: string, subtema_id: string): Promise<void> {
        await this.prisma.receitas_subtemas.delete({
            where: {
                receita_id_subtema_id: {
                    receita_id,
                    subtema_id,
                },
            },
        })
    }

    async create(
        receita_subtema: Prisma.receitas_subtemasUncheckedCreateInput,
    ): Promise<receitas_subtemas> {
        return await this.prisma.receitas_subtemas.create({
            data: receita_subtema,
        })
    }

    async findAll(): Promise<receitas_subtemas[]> {
        return await this.prisma.receitas_subtemas.findMany()
    }

    async findById(
        receita_id: string,
        subtema_id: string,
    ): Promise<receitas_subtemas | null> {
        return await this.prisma.receitas_subtemas.findUnique({
            where: {
                receita_id_subtema_id: {
                    receita_id,
                    subtema_id,
                },
            },
            include: {
                subtema: {
                    include: {
                        tema: true,
                    },
                },
            },
        })
    }

    async update(
        receita_id: string,
        subtema_id: string,
        receita_subtema: Prisma.receitas_subtemasUncheckedCreateInput,
    ): Promise<receitas_subtemas | null> {
        return await this.prisma.receitas_subtemas.update({
            where: {
                receita_id_subtema_id: {
                    receita_id,
                    subtema_id,
                },
            },
            data: receita_subtema,
        })
    }
}
