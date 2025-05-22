import { Prisma, subtema } from "../../generated/prisma";

export interface SubtemaRepository {
    create(subtema: Prisma.subtemaUncheckedCreateInput): Promise<subtema>;
    findById(id: number): Promise<subtema | null>;
    findAll(): Promise<subtema[]>;
    update(id: number, subtema: Prisma.subtemaUncheckedUpdateInput): Promise<subtema | null>;
    delete(id: number): Promise<void>;
}
