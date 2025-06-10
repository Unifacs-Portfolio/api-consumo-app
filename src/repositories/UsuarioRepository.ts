import { Prisma, usuarios } from "../../generated/prisma/client";

export interface UsuarioRepository {
    findAll(): Promise<usuarios[]>;
    findByEmail({ email }: Pick<usuarios, 'email'>): Promise<usuarios | null>;
    getMonitorStatusByEmail({ email }: Pick<usuarios, 'email'>): Promise<boolean | null>;
    create({
        email, 
        dicas, 
        foto_usuario,
        is_monitor,
        nivel_consciencia,
        nome,
        receitas,
        senha,
        telefone,
        tokens
    }: Prisma.usuariosUncheckedCreateInput): Promise<usuarios>;
    updateOne({
            email, 
            foto_usuario,
            is_monitor,
            nivel_consciencia,
            nome,
            senha,
            telefone,
            tokens,
        }: Required<Pick<usuarios, 'email'>> & usuarios): Promise<usuarios>;
    delete({ email }: Pick<usuarios, 'email'>): Promise<void>;
    updatePasswordByEmail(email: string, senha: string): Promise<void>;
}