import { ingredientes, Prisma } from "../../generated/prisma";

export interface IngredienteRepository {
    create(ingrediente: Prisma.ingredientesUncheckedCreateInput): Promise<ingredientes>;
    update(id: number, ingrediente: Prisma.ingredientesUncheckedUpdateInput): Promise<ingredientes>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<ingredientes | null>;
    findAll(): Promise<ingredientes[]>;
    findByPostagemId(postagemId: number): Promise<ingredientes[]>;
}
