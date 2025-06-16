import type { ingredientes, Prisma } from '../../generated/prisma'

export interface IngredienteRepository {
    create(
        ingrediente: Prisma.ingredientesUncheckedCreateInput,
    ): Promise<ingredientes>
    update(
        id: ingredientes['id'],
        ingrediente: Prisma.ingredientesUncheckedUpdateInput,
    ): Promise<ingredientes>
    delete(id: ingredientes['id']): Promise<void>
    findById(id: ingredientes['id']): Promise<ingredientes | null>
    findAll(): Promise<ingredientes[]>
    findByPostagemId(
        receitaId: ingredientes['receita_id'],
    ): Promise<ingredientes[]>
}
