import Dica from '../models/Dica';

describe('Dica Model', () => {
  it('should pass with original assertions', () => {
    const DicaTeste = {
      nomeCriador: 'nomeCriador',
      conteudo: 'conteudo',
      tema: 1,
      categoria: 'categoria'
    };

    const dica = new Dica(DicaTeste as any); 
    const dicaT = dica as typeof dica & {
      nomeCriador: string;
      conteudo: string;
      tema: number;
      categoria: string;
    };

    expect(dicaT).not.toBeNull();
    expect(dicaT).toBeDefined();
    expect(dicaT).toBeInstanceOf(Dica);
    expect(dicaT.nomeCriador).toBe('nomeCriador');
    expect(dicaT.conteudo).toBe('conteudo');
    expect(dicaT.tema).toBe(1);
    expect(dicaT.categoria).toBe('categoria');
  });
});
describe('Dica Controller', () => {
    // TODO
})