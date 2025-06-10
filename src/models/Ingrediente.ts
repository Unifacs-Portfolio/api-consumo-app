import {supabase} from "../supabase/client";

class Ingrediente {

    // Definindo os atributos da classe
    nomeIngrediente: string;
    quantidade: number;
    medida: string;

    // Construtor da classe
    constructor({ nomeIngrediente, quantidade, medida }: { nomeIngrediente: string; quantidade: number; medida: string }) {
        this.nomeIngrediente = nomeIngrediente;
        this.quantidade = quantidade;
        this.medida = medida;
    }

    // Método para validar os dados do ingrediente
    validate() {
        const errors = [];

        if (this.nomeIngrediente.length < 1 || this.nomeIngrediente.length > 20) {
            errors.push('Nome do ingrediente deve ter entre 1 e 20 caracteres.');
        }

        if (this.quantidade <= 0) {
            errors.push('Quantidade deve ser maior que 0.');
        }

        if (typeof this.medida !== 'string') {
            errors.push('Medida deve ser uma string, ex: Unidade, Centímetros.');
        }

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        return { valid: true };
    }

    // Método para salvar o ingrediente no banco de dados
    async save(postagemId: string): Promise<{ data: unknown[] | null, error: Error | null }> {
        const { data, error } = await supabase
            .from('ingredientes')
            .insert([
                {
                    ingrediente: this.nomeIngrediente,
                    quantidade: this.quantidade,
                    medida: this.medida,
                    postagemId: postagemId
                }
            ]);

        if (error) {
            throw new Error(error.message);
        }

        return { data, error };
    }
}

export default Ingrediente;
