import { supabase } from '../db'

interface SubtemaInterface {
    id: number
    descricao: string
}

class Tema {
    // Definindo os atributos da classe
    id: number
    descricao: string

    // Construtor da classe
    constructor({ id, descricao }: SubtemaInterface) {
        this.id = id
        this.descricao = descricao
    }

    // Método para validar os dados do tema
    validate() {
        const errors = []

        if (!this.descricao || typeof this.descricao !== 'string') {
            errors.push(`A descrição "${this.descricao}" não é válida.`)
        }

        if (errors.length > 0) {
            return { valid: false, errors }
        }

        return { valid: true }
    }

    async save(): Promise<SubtemaInterface> {
        const { data, error } = await supabase
            .from('tema')
            .insert([{ descricao: this.descricao }])
            .select()

        if (error) {
            throw new Error(`Erro ao salvar o tema: ${error.message}`)
        }

        // Verificação para garantir que data não é null ou vazio
        if (!data || data.length === 0) {
            throw new Error('Nenhum dado retornado ao salvar o tema.')
        }

        return data[0]
    }

    static async findById(id: number) {
        const { data, error } = await supabase
            .from('tema')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return null
        }

        return data
    }

    static async deleteById(id: number) {
        const { data, error } = await supabase
            .from('tema')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            throw new Error(`Erro ao deletar o tema: ${error.message}`)
        }

        return data
    }
}

export default Tema
