import { tema, temasubtema } from "../../generated/prisma";

export interface TemaRepository {
    findAll(): Promise<tema[]>;
    findById({ id }: Pick<tema, 'id'>): Promise<tema | null>;
    delete({ id }: Pick<tema, 'id'>): Promise<void>;
    /* checkIfExists(id: number): Promise<boolean>; */
}
