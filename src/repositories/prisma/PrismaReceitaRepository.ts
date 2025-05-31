import { receitas, receitas_subtemas, Prisma, PrismaClient, ingredientes } from "../../../generated/prisma";
import { ReceitaRepository } from "../ReceitaRepository";

export class PrismaReceitaRepository implements ReceitaRepository{

    private prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async create(receita: Prisma.receitasUncheckedCreateInput): Promise<receitas> {
       
        return this.prisma.receitas.create({data: receita});
    }

    async update(id: string, receita: Prisma.receitasUncheckedUpdateInput): Promise<receitas> {
       
        return this.prisma.receitas.update({
            where: { id },
            data: receita
        })
    }

    async delete(id: string): Promise<void> {
        
        await this.prisma.receitas.delete({where: {id}});
    }

    async findById(id: string): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; }) | null> {
        
        return this.prisma.receitas.findUnique({
            where: { id },
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        });
    }

    async findAll(): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; })[]> {
        
        return this.prisma.receitas.findMany({
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        });
    }

    async findAllByTheme(tema: string): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; })[]> {
        
        return this.prisma.receitas.findMany({
            where: { 
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema
                            }
                        }
                    }
                }
             },
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        })
    } 

    async findAllVerifiedByTheme(tema: string): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; })[]> {
      
        return this.prisma.receitas.findMany({
            where: { 
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema
                            }
                        }
                    }
                }
             },
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        });
    }

    async findAllNotVerifiedByTheme(tema: string): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; })[]> {
       
        return this.prisma.receitas.findMany({
            where: { 
                receitas_subtemas: {
                    some: {
                        subtema: {
                            tema: {
                                nome: tema
                            }
                        }
                    }
                }
             },
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        });
    }

    async getReceitasPorSubtemas(tema: string, subtemas: string[]): Promise<(receitas & { receitas_subtemas: receitas_subtemas[]; ingredientes: ingredientes[]; })[]> {
        
        return this.prisma.receitas.findMany({
            where: {
                receitas_subtemas: {
                    some: {
                        subtema: {
                            nome: { in: subtemas},
                            tema: { nome: tema }
                        }
                    }
                }
            },
            include: {
                receitas_subtemas: true,
                ingredientes: true
            }
        });

    }

    async verify(id: string, verifyBy: string): Promise<receitas> {
        
        return this.prisma.receitas.update({
            where: { id },
            data: {
                is_verify: true,
                verify_by: verifyBy,
                data_alteracao: new Date()
            }
        });
    }

}