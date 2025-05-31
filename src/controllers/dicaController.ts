
import Dica from '../models/Dica';
//import { supabase } from '../supabase/client';
import { TEMAS_VALIDOS } from '../utils/temas_validos';
import Subtema from "../models/Subtemas";
import { Request, Response } from 'express';
import { PrismaUsuarioRepository } from '../repositories/prisma/PrismaUsuarioRepository';
import { PrismaDicaRepository } from '../repositories/prisma/PrismaDicaRepository';
import { PrismaTemaSubtemaRepository } from '../repositories/prisma/PrismaTemaSubtemaRepository';
import { PrismaDicaSubtemaRepository } from '../repositories/prisma/PrismaDicaSubtemaRepository';
/* interface Correlacao {
    subtema: string;
    tema: string;
} */

class DicaController {

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dica = new Dica(req.body);
            const { valid, errors } = dica.validate();

            if (!valid) return handleError(res, errors?.join(', ') || '', 400, 'Dica Inválida');

            const tema = req.body.tema;
            const subtemas = req.body.subtemas
                ? (Array.isArray(req.body.subtemas) ? req.body.subtemas : [req.body.subtemas])
                : [];
            const titulo = req.body.titulo;

            if (!titulo || titulo.trim() === '') {
                return handleError(res, 'O campo "titulo" é obrigatório.', 400, 'Campo faltando');
            }

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Tema inválido');
            }

            /* const { data: usuarioData, error: usuarioError } = await supabase
                .from('usuarios')
                .select('isMonitor')
                .eq('email', dica.usuarioId)
                .single(); */
            let isCreatedBySpecialist;
            try {
                const usuarioRepository = new PrismaUsuarioRepository();
                const isMonitor = await usuarioRepository.getMonitorStatusByEmail({
                    email: dica.usuarioId
                })
                if (isMonitor === null) {
                    return handleError(res, `O usuário com o email ${dica.usuarioId} não foi encontrado.`, 404, 'Usuário não encontrado');
                }
                isCreatedBySpecialist = isMonitor
            } catch (error) {
                return handleError(res, String(error), 500, 'Erro ao verificar usuário');
            }


            /* const { data: dicaData, error: dicaError } = await supabase
                .from('dicas')
                .insert({
                    usuarioid: dica.usuarioId,
                    conteudo: dica.conteudo,
                    titulo: titulo,
                    isVerify: false,
                    verifyBy: null,
                    dataCriacao: new Date(),
                    ultimaAlteracao: new Date(),
                    iscreatedbyspecialist: isCreatedBySpecialist,
                })
                .select(); */
            let dicaData;
            try {
                const dicaRepository = new PrismaDicaRepository();
                dicaData = await dicaRepository.create({
                    usuario_id: dica.usuarioId,
                    conteudo: dica.conteudo,
                    titulo: titulo,
                    is_verify: false,
                    verify_by: '',
                    data_criacao: new Date(),
                    data_alteracao: new Date(),
                    is_created_by_specialist: isCreatedBySpecialist
                });
            } catch (error) {
                return handleError(res, String(error), 400, 'Dica inválida');
            }

            const subtemaObj = new Subtema(subtemas);
            if (subtemas.length > 0) {
                const resultadoSubtema = await subtemaObj.validate();

                if (resultadoSubtema.erros.length > 0) {
                    return handleError(res, resultadoSubtema.erros?.join(', ') || '', 400, 'Erro ao processar subtemas');
                }

                for (let subtema of subtemas) {
                    /* const { data: temaSubtemaData, error: temaSubtemaError } = await supabase
                        .from('temaSubtema')
                        .select('*')
                        .eq('tema', tema)
                        .eq('subtema', subtema);

                    if (temaSubtemaError) {
                        return handleError(res, temaSubtemaError.message, 500, 'Erro ao verificar relação tema-subtema');
                    } */

                    let temaSubtemaData;
                    try {
                        const temaSubtemaRepository = new PrismaTemaSubtemaRepository();
                        temaSubtemaData = await temaSubtemaRepository.findByTemaAndSubtema({
                            temaId: tema,
                            subtemaId: subtema
                        });
                    } catch (error) {
                        return handleError(res, String(error), 500, 'Erro ao verificar relação tema-subtema');
                    }


                    if (temaSubtemaData.length === 0) {
                        /* const { error: insertTemaSubtemaError } = await supabase
                            .from('temaSubtema')
                            .insert({
                                tema: tema,
                                subtema: subtema,
                            });

                        if (insertTemaSubtemaError) {
                            return handleError(res, insertTemaSubtemaError.message, 500, 'Erro ao criar relação tema-subtema');
                        } */
                        const temaSubtemaRepository = new PrismaTemaSubtemaRepository();
                        try {
                            await temaSubtemaRepository.create({
                                tema_id: tema,
                                subtema_id: subtema
                            });
                        } catch (error) {
                            return handleError(res, String(error), 400, 'Erro ao criar relação tema-subtema');
                        }
                    }

                    /* const { error: correlacaoError } = await supabase
                        .from('correlacaoDicas')
                        .insert({
                            idDicas: dicaData[0].id,
                            tema: tema,
                            subtema: subtema,
                        });

                    if (correlacaoError) return handleError(res, correlacaoError.message, 500, correlacaoError.details); */
                    try {
                        const temaSubtemaRepository = new PrismaTemaSubtemaRepository();
                        await temaSubtemaRepository.create({
                            tema_id: tema,
                            subtema_id: subtema
                        });
                    } catch (error) {
                        return handleError(res, String(error), 400, 'Erro ao criar relação tema-subtema');
                    }
                }
            } else {
                /* const { error: correlacaoError } = await supabase
                    .from('correlacaoDicas')
                    .insert({
                        idDicas: dicaData[0].id,
                        tema: tema,
                    });

                if (correlacaoError) return handleError(res, correlacaoError.message, 500, correlacaoError.details);
             */
                try {
                    const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
                    await dicaSubtemaRepository.create({
                        dica_id: dicaData.id,
                        subtema_id: tema,
                        assunto: ''
                    });
                } catch (error) {
                    return handleError(res, String(error), 500, 'Erro ao criar relação dica-subtema');
                }
            }

            res.status(201).json({ message: 'Dica criada com sucesso', data: dicaData });
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getAll(_req: Request, res: Response): Promise<void> {

        try {

            /* const { data: dicas, error } = await supabase
                .from('dicas')
                .select('*, correlacaoDicas(tema, subtema)')
                .order('id', { ascending: false });

            if (error) return handleError(res, error.message, 500, error.details);
 */         const dicasRepository = new PrismaDicaRepository();
            const dicas = await dicasRepository.findAllWithCorrelacaoOrderById();
            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas[0].subtema_id,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getByCode(req: Request, res: Response): Promise<void> {
        try {
            /* const { data: dica, error } = await supabase
                .from('dicas')
                .select('*, correlacaoDicas(tema, subtema)')
                .eq('id', req.params.id)
                .single();

            if (error || !dica) return handleError(res, `A dica com o código ${req.params.id} não foi encontrada.`, 404, 'Dica não encontrada');
 */         const dicaRepository = new PrismaDicaRepository();
            const dica = await dicaRepository.findById(req.params.id)
            if (!dica) {
                return handleError(res, `A dica com o código ${req.params.id} não foi encontrada.`, 404, 'Dica não encontrada');
            }


            res.json({
                id: dica.id,
                titulo: dica.titulo,
                conteudo: dica.conteudo,
                isVerify: dica.is_verify,
                idUsuario: dica.usuario_id,
                verifyBy: dica.verify_by,
                dataCriacao: dica.data_criacao,
                ultimaAlteracao: dica.data_alteracao,
                tema: dica.dicas_subtemas[0].subtema_id,
                subtemas: Array.from(dica.dicas_subtemas),
            });

        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedDica = new Dica(req.body);
            const { valid, errors } = updatedDica.validate();

            if (!valid) return handleError(res, errors?.join(', ') || '', 400, 'Essa dica não é válida');

            const tema = req.body.tema;
            const subtemas = req.body.subtemas;

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Tema inválido');
            }

            const subtemaObj = new Subtema(subtemas);
            const resultadoSubtema = await subtemaObj.validate();

            if (resultadoSubtema.erros.length > 0) {
                return handleError(res, resultadoSubtema.erros?.join(', ') || '', 400, 'Erro ao processar subtemas');
            }

            /* const { data: dicaAtualizada, error: updateError } = await supabase
                .from('dicas')
                .update({
                    conteudo: updatedDica.conteudo,
                })
                .eq('id', req.params.id)
                .select();

            if (updateError) return handleError(res, updateError.message, 500, updateError.details);
             */
            const dicaRepository = new PrismaDicaRepository();
            const dicaAtualizada = await dicaRepository.update(req.params.id, {
                conteudo: updatedDica.conteudo,
            });
            if (!dicaAtualizada) {
                return handleError(res, `Dica com o código ${req.params.id} não encontrada.`, 404, 'Dica não encontrada');
            }

            for (let subtema of subtemas) {
                /* const { data: temaSubtemaData, error: temaSubtemaError } = await supabase
                    .from('temaSubtema')
                    .select('*')
                    .eq('tema', tema)
                    .eq('subtema', subtema);

                if (temaSubtemaError) {
                    return handleError(res, temaSubtemaError.message, 500, 'Erro ao verificar relação tema-subtema');
                } */

                const temaSubtemaRepository = new PrismaTemaSubtemaRepository();
                const temaSubtemaData = await temaSubtemaRepository.findByTemaAndSubtema({
                    temaId: tema,
                    subtemaId: subtema
                });

                if (!temaSubtemaData || temaSubtemaData.length === 0) {
                    /* const { error: insertTemaSubtemaError } = await supabase
                        .from('temaSubtema')
                        .insert({
                            tema: tema,
                            subtema: subtema,
                        });

                    if (insertTemaSubtemaError) {
                        return handleError(res, insertTemaSubtemaError.message, 500, 'Erro ao criar relação tema-subtema');
                    } */
                    await temaSubtemaRepository.create({
                        tema_id: tema,
                        subtema_id: subtema
                    });
                }

                /* const { error: correlacaoError } = await supabase
                    .from('correlacaoDicas')
                    .upsert({
                        idDicas: req.params.id,
                        tema: tema,
                        subtema: subtema,
                    });

                if (correlacaoError) {
                    return handleError(res, correlacaoError.message, 500, correlacaoError.details);
                } */
                const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
                await dicaSubtemaRepository.create({
                    dica_id: req.params.id,
                    subtema_id: subtema,
                    assunto: ''
                });
            }

            /* const { data: correlacoesAtuais, error: fetchCorrelacaoError } = await supabase
                .from('correlacaoDicas')
                .select('subtema')
                .eq('idDicas', req.params.id);

            if (fetchCorrelacaoError) {
                return handleError(res, fetchCorrelacaoError.message, 500, fetchCorrelacaoError.details);
            } */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();

            const subtemasAtuais = await dicaSubtemaRepository.findByDicaId(req.params.id);

            const subtemasParaRemover = subtemasAtuais.filter(subtemaAtual => !subtemas.includes(subtemaAtual.subtema_id));

            if (subtemasParaRemover.length > 0) {
                /* const { error: deleteCorrelacaoError } = await supabase
                    .from('correlacaoDicas')
                    .delete()
                    .eq('idDicas', req.params.id)
                    .in('subtema', subtemasParaRemover);

                if (deleteCorrelacaoError) {
                    return handleError(res, deleteCorrelacaoError.message, 500, deleteCorrelacaoError.details);
                } */
                await dicaSubtemaRepository.deleteMany(req.params.id);
            }

            res.status(200).json({ message: 'Dica e correlações atualizadas com sucesso', data: dicaAtualizada });
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const dicaId = req.params.id;
/*
            const { error: deleteCorrelacaoError } = await supabase
                .from('correlacaoDicas')
                .delete()
                .eq('idDicas', dicaId);

            if (deleteCorrelacaoError) return handleError(res, deleteCorrelacaoError.message, 500, deleteCorrelacaoError.details);
 */         const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            await dicaSubtemaRepository.deleteMany(req.params.id);
            /* const { error: deleteDicaError } = await supabase
                .from('dicas')
                .delete()
                .eq('id', dicaId);

            if (deleteDicaError) return handleError(res, deleteDicaError.message, 500, deleteDicaError.details);
 */         const dicaRepository = new PrismaDicaRepository();
            await dicaRepository.delete(dicaId);
            res.status(204).end();
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async verify(req: Request, res: Response): Promise<void> {
        try {
            const verifyBy = req.body.verifyBy;
            const id = req.params.id;

            if (!verifyBy) {
                return handleError(res, `O campo 'verifyBy' é obrigátorio.`, 400, 'Input inválido');
            }

            /* const { data: user, error: userError } = await supabase
                .from('usuarios')
                .select('isMonitor')
                .eq('email', verifyBy)
                .maybeSingle(); */
            const usuarioRepository = new PrismaUsuarioRepository();
            const user = await usuarioRepository.findByEmail(verifyBy);
            if (!user) {
                return handleError(res, `O usuário com o email ${verifyBy} não foi encontrado.`, 404, 'Usuário não encontrado');
            }
            const isMonitor = await usuarioRepository.getMonitorStatusByEmail({
                email: verifyBy
            });
            if (!isMonitor) {
                return handleError(res, `O usuário com o email ${verifyBy} não é um monitor.`, 400, 'Usuário não é monitor');
            }

           /*  const { data: dica, error } = await supabase
                .from('dicas')
                .update({
                    isVerify: true,
                    verifyBy: verifyBy,
                    ultimaAlteracao: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) return handleError(res, error.message, 500, error.details);
 */       const dicaRepository = new PrismaDicaRepository();
            const dica = await dicaRepository.findById(id);
            if (!dica) return handleError(res, `A dica com o código ${id} não foi encontrada.`, 404, 'Dica não encontrada');
            await dicaRepository.update(id, {
                is_verify: true,
                verify_by: verifyBy,
                data_alteracao: new Date()
            });
            res.status(200).json({ message: `A dica com o código ${id} foi verificada com sucesso pelo usuário com o email ${verifyBy}.` });
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getAllVerifiedByTheme(req: Request, res: Response): Promise<void> {
        try {

            const { dicaId, tema } = req.params;

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }

            /* const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoDicas')
                .select('idDicas')
                .eq('tema', tema);

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
             */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            const idPost = await dicaSubtemaRepository.findByDicaId(dicaId);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            /* const { data: dicas, error } = await supabase
                .from('dicas')
                .select()
                .eq('isVerify', true)
                .in('id', idPost.map(post => post.idDicas))
                .order('id', { ascending: false });

            if (error) return handleError(res, error.message, 500, error.details);
 */
            const dicaRepository = new PrismaDicaRepository();
            const dicas = await dicaRepository.findAllByIsVerify(true);
            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                /* const subtemas = new Set();

                dica.correlacaoDicas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                }); */

                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas[0].subtema_id,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getAllNotVerifiedByTheme(req: Request, res: Response): Promise<void> {
        try {

            const { dicaId, tema } = req.params;

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }

            /* const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoDicas')
                .select('idDicas')
                .eq('tema', tema);

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
             */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            const idPost = await dicaSubtemaRepository.findByDicaId(dicaId);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            /* const { data: dicas, error } = await supabase
                .from('dicas')
                .select()
                .eq('isVerify', false)
                .in('id', idPost.map(post => post.idDicas))
                .order('id', { ascending: false });

            if (error) return handleError(res, error.message, 500, error.details);
 */       const dicaRepository = new PrismaDicaRepository();
            const dicas = await dicaRepository.findAllByIsVerify(false);
            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                /* const subtemas = new Set();

                dica.correlacaoDicas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });
 */
                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas[0].subtema_id,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);

        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getAllByTheme(req: Request, res: Response): Promise<void> {
        try {

            const { dicaId, tema } = req.params;

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }

            /* const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoDicas')
                .select('idDicas')
                .eq('tema', tema)
                .order('id', { ascending: false });

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
             */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            const idPost = await dicaSubtemaRepository.findByDicaId(dicaId);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            /* const { data: dicas, error } = await supabase
                .from('dicas')
                .select()
                .in('id', idPost.map(post => post.idDicas));

            if (error) return handleError(res, error.message, 500, error.details);
 */          const dicaRepository = new PrismaDicaRepository();
            const dicas = await dicaRepository.findAllWithCorrelacaoOrderById();
            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                /* const subtemas = new Set();

                dica.correlacaoDicas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                }); */

                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas[0].subtema_id,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);
            return;
        } catch (e) {
            if (e instanceof Error) {
                return handleError(res, e.message);
            }
        }
    }

    async getDica(req: Request, res: Response): Promise<void> {
        try {
            const tema = req.params.tema;
            const subtemas = req.params.subtema.split(',');


            const subtemasQuery = subtemas.map(subtema => `subtema.eq.${subtema}`).join(',');
            const dicaId = req.params.dicaId;
            /* const { data: correlacoes, error: correlacaoError } = await supabase
                .from('correlacaoDicas')
                .select()
                .eq("tema", tema)
                .or(subtemasQuery);

            if (correlacaoError) {
                console.error('Erro ao buscar correlações:', correlacaoError);
                res.status(500).json({ error: `Erro ao buscar correlações de dicas: ${correlacaoError.message}` });
                return;
            } */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            const correlacoes = await dicaSubtemaRepository.findByDicaId(dicaId);

            if (!correlacoes || correlacoes.length === 0) {
                res.status(200).json([]);
                return;
            }


            const idsDicas = [...new Set(correlacoes.map(correlacao => correlacao.dica_id))];
            if (idsDicas.length === 0) {
                res.status(200).json([]);
                return;
            }

            /* const { data: dicas, error: dicasError } = await supabase
                .from('dicas')
                .select('*, correlacaoDicas(*)')
                .in('id', idsDicas)
                .eq('isVerify', true)
                .order('id', { ascending: false });

            if (dicasError) {
                console.error('Erro ao buscar dicas:', dicasError);
                res.status(500).json({ error: `Erro ao buscar as dicas: ${dicasError.message}` });
                return;
            } */
            const dicaRepository = new PrismaDicaRepository();
            const dicas = await dicaRepository.findAllByIsVerify(true);

            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                /* const subtemas = new Set();

                dica.correlacaoDicas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                }); */

                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas?.[0]?.subtema_id || null,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);
            return;
        } catch (e) {
            console.error('Erro ao buscar dicas por subtemas:', e);
            if (e instanceof Error) {
                res.status(500).json({ error: `Erro interno ao processar a solicitação: ${e.message}` });
                return;
            }
        }
    }

    async getSpecialistsDica(req: Request, res: Response): Promise<void> {
        try {

            const { dicaId, tema } = req.params;

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }

            /* const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoDicas')
                .select('idDicas')
                .eq('tema', tema)
                .order('id', { ascending: false });

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
             */
            const dicaSubtemaRepository = new PrismaDicaSubtemaRepository();
            const idPost = await dicaSubtemaRepository.findByDicaId(dicaId);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            /* const { data: dicas, error } = await supabase
                .from('dicas')
                .select('*, correlacaoDicas(*)')
                .in('id', idPost.map(post => post.idDicas))
                .eq('iscreatedbyspecialist', true)
                .order('id', { ascending: false });

            if (error) return handleError(res, error.message, 500, error.details);
 */
            const dicaRepository = new PrismaDicaRepository();
            const dicas = await dicaRepository.findAllCreatedBySpecialist(true);
            const dicasComDetalhes = await Promise.all(dicas.map(async (dica) => {
                /* const subtemas = new Set();

                dica.correlacaoDicas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                }); */

                return {
                    id: dica.id,
                    titulo: dica.titulo,
                    conteudo: dica.conteudo,
                    isVerify: dica.is_verify,
                    idUsuario: dica.usuario_id,
                    verifyBy: dica.verify_by,
                    dataCriacao: dica.data_criacao,
                    ultimaAlteracao: dica.data_alteracao,
                    tema: dica.dicas_subtemas[0].subtema_id,
                    subtemas: Array.from(dica.dicas_subtemas),
                    isCreatedBySpecialist: dica.is_created_by_specialist
                };
            }));

            res.json(dicasComDetalhes);
            return;
        } catch (e) {
            console.error('Erro ao buscar dicas por subtemas:', e);
            if (e instanceof Error) {
                res.status(500).json({ error: `Erro interno ao processar a solicitação: ${e.message}` });
                return;
            }
        }
    }
}

function handleError(res: Response, detail = 'An error has occurred.', status = 500, message = 'Internal Server Error') {
    console.log(`Error: ${message} - ${detail}`);
    if (!res.headersSent) {
        res.status(status).json({ message, detail });
        return;
    }
}

export default new DicaController();