import argon2 from 'argon2'
import { supabase } from '../supabase/client' // Importa o cliente Supabase configurado

interface UserInterface {
    email: string
    tokens: string
    senha: string
    nome: string
    telefone: string
    nivelConsciencia: number
    isMonitor: boolean
    fotoUsu: string | null
}

interface SaveResponse {
    id: number
    email: string
    tokens: string
    senha: string
    nome: string
    telefone: string
    ni_conciencia: number
    is_monitor: boolean
    foto_usuario: string
}

class User {
    // Definindo os atributos da classe
    email: string
    tokens: string
    senha: string
    nome: string
    telefone: string
    nivelConsciencia: number
    isMonitor: boolean
    fotoUsu: string | null

    // Construtor da classe
    constructor({
        email,
        tokens,
        senha,
        nome,
        telefone,
        nivelConsciencia,
        isMonitor,
        fotoUsu,
    }: UserInterface) {
        this.email = email
        this.tokens = tokens
        this.senha = senha
        this.nome = nome
        this.telefone = telefone
        this.nivelConsciencia = nivelConsciencia
        this.isMonitor = isMonitor
        this.fotoUsu = fotoUsu
    }

    validate() {
        const errors = []

        if (!this.nome || this.nome.length < 3 || this.nome.length > 51) {
            errors.push('Nome deve ter entre 3 e 51 caracteres.')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Email inválido.')
        }

        if (typeof this.tokens !== 'string') {
            errors.push('Token inválido.')
        }

        const telefoneRegex = /^\+?[1-9]\d{1,14}$/ // Validação de telefone
        if (!this.telefone || !telefoneRegex.test(this.telefone)) {
            errors.push('Número de telefone inválido.')
        }

        if (!this.senha || this.senha.length < 6 || this.senha.length > 255) {
            errors.push('A senha precisa ter entre 6 e 255 caracteres.')
        }

        if (this.nivelConsciencia < 0 || this.nivelConsciencia > 5) {
            // Validação do nível de conscientização
            errors.push(
                'Nível de conscientização deve ser um número entre 0 e 5.',
            )
        }

        if (errors.length > 0) {
            return { valid: false, errors }
        }
        //this.nivelConsciencia = parseInt(this.nivelConsciencia); Não é necessário, pois já é um número. Portanto, irei deixar assim para ver como vai se comportar em testes futuros.

        return { valid: true }
    }

    // Método para salvar se o usuário já existe no banco de dados
    async save() {
        const password_hash = await argon2.hash(this.senha)

        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    email: this.email,
                    tokens: this.tokens,
                    senha: password_hash,
                    nome: this.nome,
                    telefone: this.telefone,
                    ni_conciencia: this.nivelConsciencia,
                    is_monitor: this.isMonitor,
                    foto_usuario: this.fotoUsu,
                },
            ])
            .select()

        if (error) {
            throw new Error(error.message)
        }

        return data // Retorna o primeiro usuário inserido
    }

    // Método para validar a senha do usuário
    async passwordIsValid(password: string): Promise<boolean> {
        const { data: user, error } = await supabase
            .from('usuarios') // Mudança para 'usuarios'
            .select('senha')
            .eq('email', this.email)
            .single()

        if (error || !user) {
            throw new Error('Usuário não encontrado ou erro ao buscar.')
        }

        return argon2.verify(user.senha, password) // Mudança para 'senha'
    }
}

export default User
