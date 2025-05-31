import { temas, temas_subtemas } from "../../generated/prisma";

export interface TemaRepository {
    findAll(): Promise<temas[]>;
    findById({ id }: Pick<temas, 'id'>): Promise<temas | null>;
    delete({ id }: Pick<temas, 'id'>): Promise<void>;
    /* checkIfExists(id: number): Promise<boolean>; */
}
