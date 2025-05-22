import { Prisma, usuarios } from "../../generated/prisma/client";

export interface UsuarioRepository {
    findAll(): Promise<usuarios[]>;
    findByEmail({ email }: Pick<usuarios, 'email'>): Promise<usuarios | null>;
    getMonitorStatusByEmail({ email }: Pick<usuarios, 'email'>): Promise<boolean>;
    create({
        email, 
        dicas, 
        fotousu,
        ismonitor,
        nivelconsciencia,
        nome,
        receitas,
        senha,
        telefone,
        tokens
    }: Prisma.usuariosUncheckedCreateInput): Promise<usuarios>;
    updateOne({
            email, 
            fotousu,
            ismonitor,
            nivelconsciencia,
            nome,
            senha,
            telefone,
            tokens,
        }: Required<Pick<usuarios, 'email'>> & usuarios): Promise<usuarios>;
    delete({ email }: Pick<usuarios, 'email'>): Promise<void>;
}