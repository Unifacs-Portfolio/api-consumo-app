import type { Prisma, usuarios } from '../../generated/prisma/client'

export interface UsuarioRepository {
    findAll(): Promise<usuarios[]>
    findById(id: string): Promise<usuarios | null>
    findByEmail({ email }: Pick<usuarios, 'email'>): Promise<usuarios | null>
    getMonitorStatusByEmail({
        email,
    }: Pick<usuarios, 'email'>): Promise<boolean | null>
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
        tokens,
    }: Prisma.usuariosUncheckedCreateInput): Promise<usuarios>
    updateOne({
        id,
        foto_usuario,
        is_monitor,
        nivel_consciencia,
        nome,
        senha,
        telefone,
        tokens,
    }: {
        id: usuarios['id']
        foto_usuario?: usuarios['foto_usuario']
        is_monitor?: usuarios['is_monitor']
        nivel_consciencia?: usuarios['nivel_consciencia']
        nome?: usuarios['nome']
        senha?: usuarios['senha']
        telefone?: usuarios['telefone']
        tokens?: usuarios['tokens']
    }): Promise<usuarios>
    delete({ id }: Pick<usuarios, 'id'>): Promise<void>
    updatePasswordByEmail(email: string, senha: string): Promise<void>
}
