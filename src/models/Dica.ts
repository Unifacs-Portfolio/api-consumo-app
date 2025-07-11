interface IDicaParams {
  id: string | null;
  usuarioId: string;
  conteudo: string;
  isVerify: boolean;
  verifyBy: string | null;
}

class Dica {
    id: string | null;
    usuarioId: string;
    conteudo: string;
    isVerify: boolean;
    verifyBy: string | null;

    constructor({ id = null, usuarioId, conteudo, isVerify = false, verifyBy = null }: IDicaParams) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.conteudo = conteudo;
        this.isVerify = isVerify;
        this.verifyBy = verifyBy;
    }

    validate() {
        const errors = [];

        if (!this.usuarioId || typeof this.usuarioId !== 'string' || this.usuarioId.length < 3 || this.usuarioId.length > 50) {
            errors.push('Nome do criador deve ser um texto e ter entre 3 e 50 caracteres.');
        }

        if (!this.conteudo || typeof this.conteudo !== 'string' || this.conteudo.length < 3 || this.conteudo.length > 1000) {
            errors.push('Conteúdo deve ser um texto e ter entre 3 e 1000 caracteres.');
        }

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        return { valid: true };
    }
}

export default Dica;