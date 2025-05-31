import { Prisma, PrismaClient, subtemas } from "../../../generated/prisma";
import { SubtemaRepository } from "../SubtemaRepository";

export class PrismaSubtemaRepository implements SubtemaRepository{
    private prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async create(subtema: Prisma.subtemasUncheckedCreateInput): Promise<subtemas> {
        return await this.prisma.subtemas.create({
            data: subtema,
        });
    }
    
    async findById(id: string): Promise<subtemas | null> {
        return await this.prisma.subtemas.findUnique({
            where: { id },
        });
    }
    
    async findAll(): Promise<subtemas[]> {
        return await this.prisma.subtemas.findMany();
    }
    
    async update(id: string, subtema: Prisma.subtemasUncheckedUpdateInput): Promise<subtemas | null> {
         return await this.prisma.subtemas.update({
            where: { id },
            data: subtema,
        });
    }
    
    async delete(id: string): Promise<void> {
        await this.prisma.subtemas.delete({
            where: { id },
        });
    }

}