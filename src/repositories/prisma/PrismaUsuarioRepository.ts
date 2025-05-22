import { UsuarioRepository } from '../UsuarioRepository';
import { Prisma, PrismaClient, usuarios } from '../../../generated/prisma/client';

export class PrismaUsuarioRepository implements UsuarioRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    async create(user: Prisma.usuariosUncheckedCreateInput) {
        return this.prisma.usuarios.create({
            data: user,
        });
    }
    
    async updateOne({ email, fotousu, ismonitor, nivelconsciencia, nome, senha, telefone, tokens, }: Required<Pick<usuarios, 'email'>> & usuarios): Promise<usuarios> {
        return this.prisma.usuarios.update({
            where: { email },
            data: {
                fotousu,
                ismonitor,
                nivelconsciencia,
                nome,
                senha,
                telefone,
                tokens,
            },
        });
    }

    async delete({ email }: Pick<usuarios, 'email'>) {
        await this.prisma.usuarios.delete({
            where: { email },
        });
    }
    async findAll() {
        return this.prisma.usuarios.findMany();
    }

    async findByEmail({email}: Pick<usuarios, 'email'>) {
        return this.prisma.usuarios.findUnique({
            where: { email },
        });
    }

    async getMonitorStatusByEmail({ email }: Pick<usuarios, 'email'>) {
        const statusMonitor = await this.prisma.usuarios.findUnique({
            where: { email },
            select: { ismonitor: true },
        });

        return Boolean(statusMonitor?.ismonitor);
    }
}