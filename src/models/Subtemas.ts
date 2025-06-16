import { supabase } from '../db'

interface ErroSubtema {
    subtema: string
    mensagem: string
}

interface ResultadoValidacao {
    subtemasNaoExistentes: string[]
    subtemasExistentes: string[]
    erros: ErroSubtema[]
}

class Subtema {
    // Definindo os atributos da classe
    subtemas: string[]

    // Construtor da classe
    constructor(subtemas: string[]) {
        this.subtemas = Array.isArray(subtemas) ? subtemas : []
    }

    // Método para validar os dados dos subtemas
    async validate(): Promise<ResultadoValidacao> {
        const resultado: ResultadoValidacao = {
            subtemasNaoExistentes: [],
            subtemasExistentes: [],
            erros: [],
        }

        if (!Array.isArray(this.subtemas) || this.subtemas.length === 0) {
            throw new Error('Nenhum subtema enviado.')
        }

        for (const subtema of this.subtemas) {
            const subtemaFormatado = subtema.trim()

            try {
                const subtemaExiste = await this.verifyBd(subtemaFormatado)

                if (subtemaExiste) {
                    resultado.subtemasExistentes.push(subtemaFormatado)
                } else {
                    await this.createSubtema(subtemaFormatado)
                    resultado.subtemasExistentes.push(subtemaFormatado)
                }
            } catch (e: unknown) {
                let mensagem = 'Erro desconhecido' // O erro capturado por ser qualquer tipo, por isso inicializamos com uma mensagem padrão
                if (e instanceof Error) {
                    mensagem = e.message
                }
                resultado.erros.push({ subtema: subtemaFormatado, mensagem })
            }
        }

        return resultado
    }

    // Método para verificar se o subtema já existe no banco de dados
    async verifyBd(subtema: string): Promise<boolean> {
        try {
            const { data: subtemaBd, error } = await supabase
                .from('subTema')
                .select('descricao')
                .eq('descricao', subtema)

            if (error) {
                throw new Error(error.message)
            }

            return !!(subtemaBd && subtemaBd.length > 0) // Obs: Verificar se está retornando alguma confirmação
        } catch (_e) {
            throw new Error('Erro ao verificar o subtema no banco de dados.')
        }
    }

    // Método para criar um novo subtema no banco de dados
    async createSubtema(subtema: string): Promise<void> {
        try {
            await supabase.from('subTema').insert([{ descricao: subtema }])
        } catch (_e) {
            throw new Error(`Erro ao criar subtema "${subtema}"`)
        }
    }
}

export default Subtema
