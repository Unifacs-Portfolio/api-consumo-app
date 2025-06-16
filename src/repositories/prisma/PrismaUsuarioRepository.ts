import type { UsuarioRepository } from '../UsuarioRepository'
import type {
    Prisma,
    PrismaClient,
    usuarios,
} from '../../../generated/prisma/client'
import { prisma } from '../../db'

export class PrismaUsuarioRepository implements UsuarioRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }
    findById(id: string): Promise<usuarios | null> {
        return this.prisma.usuarios.findUnique({
            where: { id },
        })
    }
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
    }: Prisma.usuariosUncheckedCreateInput): Promise<usuarios> {
        return this.prisma.usuarios.create({
            data: {
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
            },
        })
    }

    async updateOne({
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
    }): Promise<usuarios> {
        return this.prisma.usuarios.update({
            where: { id },
            data: {
                ...(foto_usuario !== undefined && { foto_usuario }),
                ...(is_monitor !== undefined && { is_monitor }),
                ...(nivel_consciencia !== undefined && { nivel_consciencia }),
                ...(nome !== undefined && { nome }),
                ...(senha !== undefined && { senha }),
                ...(telefone !== undefined && { telefone }),
                ...(tokens !== undefined && { tokens }),
            },
        })
    }

    async updatePasswordByEmail(email: string, senha: string): Promise<void> {
        await this.prisma.usuarios.update({
            where: { email },
            data: { senha },
        })
    }

    async delete({ id }: Pick<usuarios, 'id'>) {
        await this.prisma.usuarios.delete({
            where: { id },
        })
    }

    async findAll() {
        return this.prisma.usuarios.findMany()
    }

    async findByEmail({ email }: Pick<usuarios, 'email'>) {
        return this.prisma.usuarios.findUnique({
            where: { email },
        })
    }

    async getMonitorStatusByEmail({
        email,
    }: Pick<usuarios, 'email'>): Promise<boolean | null> {
        const statusMonitor = await this.prisma.usuarios.findUnique({
            where: { email },
            select: { is_monitor: true },
        })
        return statusMonitor ? statusMonitor.is_monitor : null
    }
}
