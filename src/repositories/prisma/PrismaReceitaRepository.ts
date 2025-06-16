import type {
    receitas,
    receitas_subtemas,
    Prisma,
    PrismaClient,
    ingredientes,
} from '../../../generated/prisma'
import type { ReceitaRepository } from '../ReceitaRepository'
import { prisma } from '../../db'

export class PrismaReceitaRepository implements ReceitaRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    // Formata o resultado
    async getAllDetails() {
        // Busca todas as receitas no banco, ordenadas por data de criação (mais recentes primeiro)
        return await this.prisma.receitas.findMany({
            orderBy: {
                data_criacao: 'desc',
            },
            include: {
                // Inclui o relacionamento com o tema principal da receita
                tema: true,
                // Inclui os subtemas relacionados, e dentro de cada relação inclui o subtema propriamente dito
                receitas_subtemas: {
                    include: {
                        subtema: true,
                    },
                },
            },
        })
    }

    async create(
        receita: Prisma.receitasUncheckedCreateInput,
    ): Promise<receitas> {
        return this.prisma.receitas.create({ data: receita })
    }

    async update(
        id: string,
        receita: Prisma.receitasUncheckedUpdateInput,
    ): Promise<receitas> {
        return this.prisma.receitas.update({
            where: { id },
            data: receita,
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.receitas.delete({ where: { id } })
    }

    async findById(id: string): Promise<receitas | null> {
        return this.prisma.receitas.findUnique({
            where: { id },
        })
    }

    async findAll() {
        return this.prisma.receitas.findMany({
            include: {
                receitas_subtemas: true,
                ingredientes: true,
            },
        })
    }

    async findAllByTheme(tema: string): Promise<
        (receitas & {
            receitas_subtemas: receitas_subtemas[]
            ingredientes: ingredientes[]
        })[]
    > {
        return this.prisma.receitas.findMany({
            where: {
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema,
                            },
                        },
                    },
                },
            },
            include: {
                receitas_subtemas: true,
                ingredientes: true,
            },
        })
    }

    async findAllVerifiedByTheme(tema: string): Promise<
        (receitas & {
            receitas_subtemas: receitas_subtemas[]
            ingredientes: ingredientes[]
        })[]
    > {
        return this.prisma.receitas.findMany({
            where: {
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema,
                            },
                        },
                    },
                },
            },
            include: {
                receitas_subtemas: true,
                ingredientes: true,
            },
        })
    }

    async findAllNotVerifiedByTheme(tema: string): Promise<
        (receitas & {
            receitas_subtemas: receitas_subtemas[]
            ingredientes: ingredientes[]
        })[]
    > {
        return this.prisma.receitas.findMany({
            where: {
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema,
                            },
                        },
                    },
                },
            },
            include: {
                receitas_subtemas: true,
                ingredientes: true,
            },
        })
    }

    async getReceitasPorSubtemas(
        tema: string,
        subtemas: string[],
    ): Promise<
        (receitas & {
            receitas_subtemas: receitas_subtemas[]
            ingredientes: ingredientes[]
        })[]
    > {
        return this.prisma.receitas.findMany({
            where: {
                receitas_subtemas: {
                    some: {
                        subtema: {
                            nome: { in: subtemas },
                            tema: { nome: tema },
                        },
                    },
                },
            },
            include: {
                receitas_subtemas: true,
                ingredientes: true,
            },
        })
    }

    async verify(id: string, verifyBy: string): Promise<receitas> {
        return this.prisma.receitas.update({
            where: { id },
            data: {
                is_verify: true,
                verify_by: verifyBy,
                data_alteracao: new Date(),
            },
        })
    }
}
