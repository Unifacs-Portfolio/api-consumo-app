import { supabase } from '../supabase/client';

interface ErroSubtema {
  subtema: string;
  mensagem: string;
}

interface ResultadoValidacao {
  subtemasNaoExistentes: string[]; 
  subtemasExistentes: string[];
  erros: ErroSubtema[];
}

class Subtema { 

  // Definindo os atributos da classe
  subtemas: string[];

  // Construtor da classe
  constructor(subtemas: string[]) {
    this.subtemas = Array.isArray(subtemas) ? subtemas : [];
  }

  // Método para validar os dados dos subtemas
  async validate(): Promise<ResultadoValidacao> {
    let resultado: ResultadoValidacao = {
      subtemasNaoExistentes: [],
      subtemasExistentes: [],
      erros: []
    };

    if (!Array.isArray(this.subtemas) || this.subtemas.length === 0) {
      throw new Error("Nenhum subtema enviado.");
    }
    
    for (let subtema of this.subtemas) {
      let subtemaFormatado = subtema.trim(); 

      try {
        let subtemaExiste = await this.verifyBd(subtemaFormatado);

        if (subtemaExiste) {
          resultado.subtemasExistentes.push(subtemaFormatado);
        } else {
          await this.createSubtema(subtemaFormatado);
          resultado.subtemasExistentes.push(subtemaFormatado); 
        }
      } catch (e: any) {
        resultado.erros.push({ subtema: subtemaFormatado, mensagem: e.message });
      }
    }

    return resultado;
  }

  // Método para verificar se o subtema já existe no banco de dados
  async verifyBd(subtema: string): Promise<boolean> {
    try {
      let { data: subtemaBd, error } = await supabase
        .from('subTema')
        .select('descricao')
        .eq('descricao', subtema);

      if (error) {
        throw new Error(error.message);
      }

      return !!(subtemaBd && subtemaBd.length > 0); // Obs: Verificar se está retornando alguma confirmação
    } catch (e) {
      throw new Error('Erro ao verificar o subtema no banco de dados.');
    }
  }

  // Método para criar um novo subtema no banco de dados
  async createSubtema(subtema: string): Promise<void> {
    try {
      let { data, error } = await supabase
        .from('subTema')
        .insert([{ descricao: subtema }]);

    } catch (e) {
      throw new Error(`Erro ao criar subtema "${subtema}"`);
    }
  }
}

export default Subtema;