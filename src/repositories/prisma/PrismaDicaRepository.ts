import { Prisma, PrismaClient, dicas, dicas_subtemas } from "../../../generated/prisma";
import { DicaRepository } from "../DicaRepository";

export class PrismaDicaRepository implements DicaRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    findAllCreatedBySpecialist(specialistId: dicas["is_created_by_specialist"]): Promise<(dicas & { dicas_subtemas: dicas_subtemas[]; })[]> {
        return this.prisma.dicas.findMany({
            where: {
                is_created_by_specialist: specialistId
            },
            include: {
                dicas_subtemas: true
            }
        });
    }
    findAllByIsVerify(isVerify: dicas["is_verify"]) {
        return this.prisma.dicas.findMany({
            where: {
                is_verify: isVerify
            },
            include: {
                dicas_subtemas: true
            }
        });
    }

    async delete(id: dicas["id"]) {
        await this.prisma.dicas.delete({
            where: { id }
        });
    }
    async findById(id: dicas['id']) {
        return this.prisma.dicas.findUnique({
            where: { id },
            include: {
                dicas_subtemas: true
            }
        });
    }
    async create({
        usuario_id,
        verify_by,
        titulo,
        conteudo,
        data_criacao,
        data_alteracao,
        is_verify,
        is_created_by_specialist
    }: Prisma.dicasUncheckedCreateInput): Promise<dicas> {
        return this.prisma.dicas.create({
            data: {
                usuario_id,
                verify_by,
                titulo,
                conteudo,
                data_criacao,
                data_alteracao,
                is_created_by_specialist,
                is_verify
            }
        });
    }
    async update(id: dicas['id'], dica: Prisma.dicasUncheckedUpdateInput) {
        return this.prisma.dicas.update({
            where: { id },
            data: dica
        });
    }
    async findAllWithCorrelacaoOrderById() {
        return this.prisma.dicas.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                dicas_subtemas: true
            }
        });
    }

}