import { PrismaClient, ingredientes, Prisma } from "../../../generated/prisma";
import { IngredienteRepository } from "../IngredienteRepository";

export class PrismaIngredienteRepository implements IngredienteRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    update(id: ingredientes["id"], ingrediente: Prisma.ingredientesUncheckedUpdateInput): Promise<ingredientes> {
        return this.prisma.ingredientes.update({
            where: { id },
            data: ingrediente
        });
    }
    async delete(id: ingredientes["id"]): Promise<void> {
        await this.prisma.ingredientes.delete({ where: { id } });
    }
    async findById(id: ingredientes["id"]): Promise<ingredientes | null> {
        return this.prisma.ingredientes.findUnique({ where: { id } });
    }
    async findAll(): Promise<ingredientes[]> {
        return this.prisma.ingredientes.findMany();
    }
    async findByPostagemId(receitaId: ingredientes["receita_id"]): Promise<ingredientes[]> {
        return this.prisma.ingredientes.findMany({
            where: {
                receita_id: receitaId
            }
        });
    }
    async create(ingrediente: Prisma.ingredientesUncheckedCreateInput): Promise<ingredientes> {
        return this.prisma.ingredientes.create({ data: ingrediente });
    }

}