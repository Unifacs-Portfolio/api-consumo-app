import { receitas, correlacaoreceitas, Prisma, ingredientes, fotosreceitas } from "../../generated/prisma";

export interface ReceitaRepository {
    create(receita: Prisma.receitasUncheckedCreateInput): Promise<receitas>;
    update(id: number, receita: Prisma.receitasUncheckedUpdateInput): Promise<receitas>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] } | null>;
    findAll(): Promise<(receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] })[]>;
    findAllByTheme(tema: string): Promise<(receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] })[]>;
    findAllVerifiedByTheme(tema: string): Promise<(receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] })[]>;
    findAllNotVerifiedByTheme(tema: string): Promise<(receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] })[]>;
    getReceitasPorSubtemas(tema: string, subtemas: string[]): Promise<(receitas & { correlacaoreceitas: correlacaoreceitas[], ingredientes: ingredientes[], fotosreceitas: fotosreceitas[] })[]>;
    verify(id: number, verifyBy: string): Promise<receitas>;
}
