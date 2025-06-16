import { type Prisma, subtemas, type temas } from '../../generated/prisma'

export interface TemaRepository {
    findAll(): Promise<temas[]>
    findById({ id }: Pick<temas, 'id'>): Promise<temas | null>
    findByName({ nome }: Pick<temas, 'nome'>): Promise<temas | null>
    delete({ id }: Pick<temas, 'id'>): Promise<void>
    create(data: Prisma.temasUncheckedCreateInput): Promise<temas>
    /* checkIfExists(id: number): Promise<boolean>; */
}
