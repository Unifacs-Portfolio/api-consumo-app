import type {
    Prisma,
    PrismaClient,
    dicas,
    dicas_subtemas,
} from '../../../generated/prisma'
import type { DicaRepository } from '../DicaRepository'
import { prisma } from '../../db'

export class PrismaDicaRepository implements DicaRepository {
    private prisma: PrismaClient
    constructor() {
        this.prisma = prisma
    }
    update(id: string, dica: Prisma.dicasUncheckedUpdateInput) {
        return this.prisma.dicas.update({
            where: { id },
            data: dica,
            select: {
                id: true,
                titulo: true,
                conteudo: true,
                is_verify: true,
                verify_by: true,
                is_created_by_specialist: true,
            },
        })
    }
    findAllByThemeAndSubtema(
        temaId: string,
        subtemaId: string,
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]> {
        return this.prisma.dicas.findMany({
            where: {
                tema_id: temaId,
                dicas_subtemas: {
                    some: {
                        subtema_id: subtemaId,
                    },
                },
            },
            include: {
                dicas_subtemas: true,
            },
        })
    }

    findAllCreatedBySpecialist(
        specialistId: dicas['is_created_by_specialist'],
    ): Promise<(dicas & { dicas_subtemas: dicas_subtemas[] })[]> {
        return this.prisma.dicas.findMany({
            where: {
                is_created_by_specialist: specialistId,
            },
            include: {
                dicas_subtemas: true,
            },
        })
    }
    findAllByIsVerify(isVerify: dicas['is_verify']) {
        return this.prisma.dicas.findMany({
            where: {
                is_verify: isVerify,
            },
            include: {
                dicas_subtemas: true,
            },
        })
    }

    async delete(id: string) {
        await this.prisma.dicas.delete({
            where: { id },
        })
    }
    findById(id: string) {
        return this.prisma.dicas.findUnique({
            where: { id },
            include: {
                dicas_subtemas: true,
            },
        })
    }
    create({
        usuario_id,
        tema_id,
        verify_by,
        titulo,
        conteudo,
        data_criacao,
        data_alteracao,
        is_verify,
        is_created_by_specialist,
    }: Prisma.dicasUncheckedCreateInput): Promise<dicas> {
        return this.prisma.dicas.create({
            data: {
                usuario_id,
                tema_id,
                verify_by,
                titulo,
                conteudo,
                data_criacao,
                data_alteracao,
                is_created_by_specialist,
                is_verify,
            },
        })
    }

    findAllWithCorrelacaoOrderById() {
        return this.prisma.dicas.findMany({
            orderBy: {
                id: 'asc',
            },
            include: {
                dicas_subtemas: true,
            },
        })
    }
}
