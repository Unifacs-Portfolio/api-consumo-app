import { supabase } from '../supabase/client';
import { TEMAS_VALIDOS } from '../utils/temas_validos';
import Ingrendiente from "../models/Ingrediente";
import { Request, Response } from 'express';
import { PrismaUsuarioRepository } from '../repositories/prisma/PrismaUsuarioRepository';
import { PrismaReceitaRepository } from '../repositories/prisma/PrismaReceitaRepository';
import { PrismaSubtemaRepository } from '../repositories/prisma/PrismaSubtemaRepository';
import { PrismaReceitaSubtemaRepository } from '../repositories/prisma/PrismaReceitaSubtemaRepository';
import { PrismaIngredienteRepository } from '../repositories/prisma/PrismaIngredienteRepository';

class ReceitaController {

    async create(req:Request, res:Response): Promise<void> {
        const imageUrls = [];
        const { email, titulo, conteudo, idUsuario, temaId, subtema, ingredientes } = req.body;
        try {
            if (!req.body.titulo || !req.body.conteudo || !req.body.idUsuario || !req.body.temaId || !req.body.subtema) {
                throw new Error('Campos obrigatórios: titulo, conteudo, idUsuario, tema, subtema');
            }

            /*const { data: usuario, error: userError } = await supabase
                .from('usuarios')
                .select('email')
                .eq('email', req.body.idUsuario)
                .single();*/
            const user: PrismaUsuarioRepository = new PrismaUsuarioRepository();
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();
            const subtopic: PrismaSubtemaRepository = new PrismaSubtemaRepository();
            const recipeSubtopic: PrismaReceitaSubtemaRepository = new PrismaReceitaSubtemaRepository();



            const usuario = await user.findByEmail(email);
            
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const novaReceita = await recipe.create({
                titulo,
                conteudo,
                is_verify: false,
                usuario_id: idUsuario,
                tema_id: temaId,
                image_source: ''
            });

            /*const { data: receitaData, error: receitaError } = await supabase
                .from('receitas')
                .insert([novaReceita])
                .select()
                .single();*/
            
            
            const subtemasArray = Array.isArray(req.body.subtema) ? req.body.subtema : [req.body.subtema];

            for (const sub of subtemasArray) {
                
                /*const { data: subtemaData, error: subtemaError } = await supabase


                    .from('subTema')
                    .select('*')
                    .eq('descricao', subtema)
                    .single();

                if (subtemaError && subtemaError.code !== 'PGRST116') throw subtemaError;

                if (!subtemaData) {
                    const { error: createSubtemaError } = await supabase
                        .from('subTema')
                        .insert({ descricao: subtema });

                    if (createSubtemaError) throw createSubtemaError;
                }

                const { data: temaSubtemaData, error: temaSubtemaError } = await supabase
                    .from('temaSubtema')
                    .select('*')
                    .eq('tema', tema)
                    .eq('subtema', subtema)
                    .single();

                if (temaSubtemaError && temaSubtemaError.code !== 'PGRST116') throw temaSubtemaError;

                if (!temaSubtemaData) {
                    const { error: createTemaSubtemaError } = await supabase
                        .from('temaSubtema')
                        .insert({ tema, subtema });

                    if (createTemaSubtemaError) throw createTemaSubtemaError;
                }

                const { error: correlacaoError } = await supabase
                    .from('correlacaoReceitas')
                    .insert({
                        idReceita: receitaData.id,
                        tema,
                        subtema
                    });

                if (correlacaoError) throw correlacaoError;
            }

            const ingredientes = req.body.ingredientes;
            if (Array.isArray(ingredientes) && ingredientes.length > 0) {
                for (const ingrediente of ingredientes) {
                    const ingredienteObj = new Ingrendiente(ingrediente);
                    const { valid, errors = []} = ingredienteObj.validate();
    
                    if (!valid) {
                        throw new Error(errors.join(', '));
                    }
    
                    await ingredienteObj.save(receitaData.id);
                }
            }
            

            if (Array.isArray(req.files) && req.files.length > 0) {
                for (const file of req.files) {
                    const fileName = `${receitaData.id}-${Date.now()}-${file.originalname}`;
                    const { error: uploadError } = await supabase.storage
                        .from('fotosReceitas')
                        .upload(fileName, file.buffer, {
                            contentType: file.mimetype
                        });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('fotosReceitas')
                        .getPublicUrl(fileName);

                    const { error: fotoError } = await supabase
                        .from('fotosReceitas')
                        .insert({
                            idFoto: Date.now(),
                            id: receitaData.id,
                            url: publicUrl,
                            createdAt: new Date().toISOString()
                        });

                    if (fotoError) throw fotoError;
                    imageUrls.push(publicUrl);
                }
            }

            res.status(201).json({
                message: 'Receita criada com sucesso',
                data: {
                    ...receitaData,
                    fotos: imageUrls
                }
            });
            */
                let subtemaEntity = await subtopic.findByDescription(sub);

                if (!subtemaEntity) {
                    subtemaEntity = await subtopic.create({
                        descricao: sub,
                        tema_id: temaId,
                        nome: subtema
                    });

                    if (!subtemaEntity) {
                        throw new Error('Erro ao criar o subtema');
                    }
                }

                const receitaSubtema = await recipeSubtopic.create({
                    receita_id: novaReceita.id,
                    subtema_id: subtemaEntity.id,
                    assunto: subtemaEntity.descricao
                });
                
                if (!receitaSubtema) {
                    throw new Error('Erro ao criar o subtema da receita');
                }
            }

            if (Array.isArray(ingredientes) && ingredientes.length > 0) {
                for(const ingrediente of ingredientes){
                    const ingredienteObj = new Ingrendiente(ingrediente);
                    const { valid, errors = [] } = ingredienteObj.validate();

                    if (!valid) {
                        throw new Error(errors.join(', '));
                    }

                    await ingredienteObj.save(novaReceita.id)
                }
            }

            if (Array.isArray(req.files) && req.files.length > 0) {
                for (const file of req.files) {
                    const fileName = `${novaReceita.id}-${Date.now()}-${file.originalname}`;
                    const { error: uploadError } = await supabase.storage
                        .from('fotosReceitas')
                        .upload(fileName, file.buffer, {
                            contentType: file.mimetype
                        });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('fotosReceitas')
                        .getPublicUrl(fileName);

                    const { error: fotoError } = await supabase
                        .from('fotosReceitas')
                        .insert({
                            idFoto: Date.now(),
                            id: novaReceita.id,
                            url: publicUrl,
                            createdAt: new Date().toISOString()
                        });

                    if (fotoError) throw fotoError;
                    imageUrls.push(publicUrl);
                }
            }

            res.status(201).json({
                message: 'Receita criada com sucesso',
                data: {
                    ...novaReceita,
                    fotos: imageUrls
                }
            });
        } catch (e) {
            console.log(e)
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async getAll(req:Request, res:Response): Promise<void> {
        try {
            /*const { data: receitas, error: receitasError } = await supabase
                .from('receitas')
                .select('*, correlacaoReceitas(tema, subtema), fotosReceitas(url)')
                .order('dataCriacao', { ascending: false });

            if (receitasError) throw receitasError;

            const receitasComDetalhes = await Promise.all(receitas.map(async (receita) => {
                const subtemas = new Set();

                receita.correlacaoReceitas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.isVerify,
                    idUsuario: receita.idUsuario,
                    verifyBy: receita.verifyBy,
                    dataCriacao: receita.dataCriacao,
                    ultimaAlteracao: receita.ultimaAlteracao,
                    tema: receita.correlacaoReceitas?.[0]?.tema,
                    subtemas: Array.from(subtemas),
                    fotos: receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || []
                };
            }));

             res.json(receitasComDetalhes);
             return;*/
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();
            const receitasComDetalhes = await recipe.getAllDetails();
            
            const receitasFormatadas = receitasComDetalhes.map((receita) => {
                const subtemas = receita.receitas_subtemas
                .filter((relacao: any) => relacao.subtema?.nome)
                .map((relacao: any) => relacao.subtema.nome);

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.is_verify,
                    idUsuario: receita.usuario_id,
                    verifyBy: receita.verify_by,
                    dataCriacao: receita.data_criacao,
                    ultimaAlteracao: receita.data_alteracao,
                    tema: null,
                    subtemas: Array.from(new Set(subtemas)),
                };
            });
           
            //res.json(receitasFormatadas);
            
            // Para verificar se existe algo no banco de dados
            res.json({
                quantidade: receitasComDetalhes.length,
                dadosCru: receitasComDetalhes,  
            });
        } catch (e) {
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async getById(req:Request, res:Response): Promise<void> {

        const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();
        
        try {
            /*const { data: receita, error: receitaError } = await supabase
                .from('receitas')
                .select(`
                *,
                correlacaoReceitas(tema, subtema),
                ingredientes (*),
                fotosReceitas(url)
            `)
                .eq('id', req.params.id)
                .single();
            
            if (!receita) handleError(res, 'Receita não encontrada', 404);
            if (receitaError) throw receitaError;
                    
            const tema = receita.correlacaoReceitas?.[0]?.tema || null;
            const subtemas = receita.correlacaoReceitas?.map((correlacao: Correlacao) => correlacao.subtema) || [];
            const ingredientes = receita.ingredientes || [];
            const fotos = receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || [];

                 res.json({
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.isVerify,
                idUsuario: receita.idUsuario,
                verifyBy: receita.verifyBy,
                dataCriacao: receita.dataCriacao,
                ultimaAlteracao: receita.ultimaAlteracao,
                tema,
                subtemas,
                ingredientes,
                fotos
            });
            return;*/

            const id = req.params.body;

            if (!id) {
                handleError(res, 'ID da receita é obrigatório', 400);
                return;
            }

            const receita = await recipe.findById(id);

            if (!receita) {
                handleError(res, 'Receita não encontrada', 404);
                return;
            }

            const tema = receita.tema?.nome || null;
            const subtemas = receita.receitas_subtemas.map((rel: { subtema: { nome: string } }) => rel.subtema.nome);
            const ingredientes = receita.ingredientes;

            res.json({
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                usuarioId: receita.usuario_id,
                usuarioNome: receita.usuario?.nome || null,
                verifyBy: receita.verify_by,
                verificadoPor: receita.verify_by_user?.nome || null,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                tema,
                subtemas: Array.from(new Set(subtemas)),
                ingredientes,
                imagem: receita.image_source
            });            
        } catch (e) {
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async update(req:Request, res:Response): Promise<void> {
        let imageUrls: string[] = [];
        try {
            /*if (!req.body.titulo && !req.body.conteudo && !req.files?.length) {
                 handleError(res, 'Nenhum dado para atualizar foi fornecido', 400);
                 return;
            }

            const { data: receita, error: findError } = await supabase
                .from('receitas')
                .select('*')
                .eq('id', req.params.id)
                .single();

            if (findError || !receita) {
                 handleError(res, 'Receita não encontrada', 404);
                 return;
            }

            const { data: correlacao, error: correlacaoError } = await supabase
                .from('correlacaoReceitas')
                .select('tema')
                .eq('idReceita', req.params.id)
                .single();

            const temaAtualizado = correlacaoError || !correlacao ? req.body.tema : correlacao.tema;

            if (!temaAtualizado) {
                throw new Error('Nenhum tema disponível para a receita');
            }

            if (req.body.subtema && Array.isArray(req.body.subtema)) {
                await supabase
                    .from('correlacaoReceitas')
                    .delete()
                    .eq('idReceita', req.params.id);

                for (const subtema of req.body.subtema) {
                    const { data: subtemaData, error: subtemaError } = await supabase
                        .from('subTema')
                        .select('*')
                        .eq('descricao', subtema)
                        .single();

                    if (subtemaError && subtemaError.code !== 'PGRST116') throw subtemaError;

                    if (!subtemaData) {
                        const { error: createSubtemaError } = await supabase
                            .from('subTema')
                            .insert({ descricao: subtema });

                        if (createSubtemaError) throw createSubtemaError;
                    }

                    const { data: temaSubtemaData, error: temaSubtemaError } = await supabase
                        .from('temaSubtema')
                        .select('*')
                        .eq('tema', temaAtualizado)
                        .eq('subtema', subtema)
                        .single();

                    if (temaSubtemaError && temaSubtemaError.code !== 'PGRST116') throw temaSubtemaError;

                    if (!temaSubtemaData) {
                        const { error: createTemaSubtemaError } = await supabase
                            .from('temaSubtema')
                            .insert({ tema: temaAtualizado, subtema });

                        if (createTemaSubtemaError) throw createTemaSubtemaError;
                    }

                    const { error: correlacaoError } = await supabase
                        .from('correlacaoReceitas')
                        .insert({
                            idReceita: receita.id,
                            tema: temaAtualizado,
                            subtema
                        });

                    if (correlacaoError) throw correlacaoError;
                }
            }

            if (req.body.ingredientes && Array.isArray(req.body.ingredientes)) {
                await supabase
                    .from('ingredientes')
                    .delete()
                    .eq('postagemId', req.params.id);

                for (const ingrediente of req.body.ingredientes) {
                    const ingredienteObj = new Ingrendiente(ingrediente);
                    const { valid, errors =[] } = ingredienteObj.validate();
                   
                    const id = Number(req.params.id); //transforma a string em um number por conta que o .save pede um number

                      if (isNaN(id)) {
                      throw new Error('ID inválido');
                           }

                    if (!valid) {
                        throw new Error(errors.join(', '));
                    }

                    await ingredienteObj.save(id);
                }
            }

            if (Array.isArray(req.files) && req.files.length > 0) {
                const { data: fotosAntigas } = await supabase
                    .from('fotosReceitas')
                    .select('*')
                    .eq('id', req.params.id);

                if (fotosAntigas && fotosAntigas.length > 0) {
                    for (const foto of fotosAntigas) {
                        const fileName = foto.url.split('/fotosReceitas/').pop();
                        await supabase.storage
                            .from('fotosReceitas')
                            .remove([fileName]);
                    }

                    await supabase
                        .from('fotosReceitas')
                        .delete()
                        .eq('id', req.params.id);
                }

                for (const file of req.files) {
                    const fileName = `${receita.id}-${Date.now()}-${file.originalname}`;
                    const { error: uploadError } = await supabase.storage
                        .from('fotosReceitas')
                        .upload(fileName, file.buffer, {
                            contentType: file.mimetype
                        });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('fotosReceitas')
                        .getPublicUrl(fileName);

                    const { error: fotoError } = await supabase
                        .from('fotosReceitas')
                        .insert({
                            idFoto: Date.now(),
                            id: receita.id,
                            url: publicUrl,
                            createdAt: new Date().toISOString()
                        });

                    if (fotoError) throw fotoError;
                    imageUrls.push(publicUrl);
                }
            }

            const dadosAtualizados = {
                titulo: req.body.titulo || receita.titulo,
                conteudo: req.body.conteudo || receita.conteudo,
                isVerify: receita.isVerify,
                idUsuario: receita.idUsuario,
                verifyBy: receita.verifyBy,
                dataCriacao: receita.dataCriacao,
                ultimaAlteracao: new Date().toISOString()
            };

            const { data: receitaAtualizada, error: updateError } = await supabase
                .from('receitas')
                .update(dadosAtualizados)
                .eq('id', req.params.id)
                .select()
                .single();

            if (updateError) throw updateError;

            res.json({
                message: 'Receita atualizada com sucesso',
                data: { ...receitaAtualizada, fotos: imageUrls }
            });
            return;*/
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();
            const recipeSubtopic: PrismaReceitaSubtemaRepository = new PrismaReceitaSubtemaRepository();
            const ingredient: PrismaIngredienteRepository = new PrismaIngredienteRepository();


            if (!req.body.titulo && !req.body.conteudo && !req.files?.length) {
                    handleError(res, 'Nenhum dado para atualizar foi fornecido', 400);
                    return;
            }

            const { idReceita, idReceitaSubtema } = req.params;

            const receita = await recipe.findById(idReceita);

            if (!receita) {
                handleError(res, 'Receita não encontrada', 404);
                return;
            }

            const correlacao = await recipeSubtopic.findById(idReceita, idReceitaSubtema);

            const temaAtualizado = correlacao?.subtema_id || req.body; // Depois, ver se está funcionando

            if (!temaAtualizado) {
                throw new Error('Nenhum tema disponível para a receita');
            }

            if (req.body.subtema && Array.isArray(req.body.subtema)) {
                await recipeSubtopic.delete(idReceita, idReceitaSubtema);

                for(const subtemaDescricao of req.body.subtema){
                    let subtema = await recipeSubtopic.findById(idReceita, idReceitaSubtema);

                    if (!subtema) {
                        subtema = await recipeSubtopic.create({
                            receita_id: receita.id,
                            subtema_id: subtemaDescricao.id,
                            assunto: subtemaDescricao.descricao
                        });
                    }

                    await recipeSubtopic.create({
                            receita_id: receita.id,
                            subtema_id: subtemaDescricao.id,
                            assunto: subtemaDescricao.descricao
                        });
                }
            }

            if (req.body.ingredientes && Array.isArray(req.body.ingredientes)) {
                await ingredient.delete(receita.id);

                for(const ingredienteData of req.body.ingredientes){
                    const ingredienteObj = new Ingrendiente(ingredienteData);
                    const { valid, errors = [] } = ingredienteObj.validate();

                    if (!valid) {
                        throw new Error(errors.join(', '));
                    }

                    await ingredienteObj.save(receita.id);
                }
            }

            const receitaAtualizada = await recipe.update(
                receita.id,
                {
                    titulo: req.body.titulo || receita.titulo,
                    conteudo: req.body.conteudo || receita.conteudo,
                    data_alteracao: new Date()
                }
            );

            res.json({
                message: 'Receita atualizada com sucesso',
                data: {
                    ...receitaAtualizada,
                    fotos: imageUrls
                }
            });

        } catch (e) {
            if (imageUrls.length > 0) {
                for (const url of imageUrls) {
                    const fileName: string | undefined= url.split('/fotosReceitas/').pop();
                    if (fileName) {
                        await supabase.storage
                            .from('fotosReceitas')
                            .remove([fileName]);
                    }
                }
            }
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async delete(req:Request, res:Response): Promise<void> {
        try {
            /*const { data: receita, error: findError } = await supabase
                .from('receitas')
                .select('*')
                .eq('id', req.params.id)
                .single();

            if (findError || !receita) {
                 handleError(res, 'Receita não encontrada', 404);
                 return;
            }

            // Primeiro, buscar todas as fotos da receita
            const { data: fotos, error: fotosError } = await supabase
                .from('fotosReceitas')
                .select('*')  // Alterado de 'url' para '*' para pegar todos os dados
                .eq('id', req.params.id);

            if (fotosError) throw fotosError;

            // Se existem fotos, deletar do bucket e da tabela
            if (fotos?.length > 0) {
                for (const foto of fotos) {
                    // Extrair o nome do arquivo da URL
                    const fileName = foto.url.split('/fotosReceitas/').pop();

                    console.log('Tentando deletar arquivo:', fileName);

                    const { error: deleteStorageError } = await supabase.storage
                        .from('fotosReceitas')
                        .remove([fileName]);

                    if (deleteStorageError) {
                        console.error('Erro ao deletar arquivo:', deleteStorageError);
                        throw deleteStorageError;
                    }
                }

                // Deletar registros da tabela fotosReceitas
                const { error: deleteFotosError } = await supabase
                    .from('fotosReceitas')
                    .delete()
                    .eq('id', req.params.id);

                if (deleteFotosError) throw deleteFotosError;
            }

            // Por fim, deletar a receita
            const { error: deleteError } = await supabase
                .from('receitas')
                .delete()
                .eq('id', req.params.id);

            if (deleteError) throw deleteError;

             res.json({
                message: 'Receita e fotos deletadas com sucesso'
            });
            return;*/
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();

            const { id } = req.params;

            const receita = await recipe.findById(id);

            if (!receita) {
                return handleError(res, 'Receita não encontrada', 404);
            }

            const fotos = await recipe.delete(id);

            res.json({
                message: 'Receita deletada com sucesso',
            });

        } catch (e) {
            console.error('Erro completo:', e);
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async verify(req:Request, res:Response): Promise<void> {
        try {
            /*const verifyBy = req.body.verifyBy;
            const id = req.params.id;

            if (!verifyBy) {
                 handleError(res, `O campo 'verifyBy' é obrigátorio.`, 400, 'Input inválido');
                 return;
            }

            const { data: user,  error :userError } = await supabase
                .from('usuarios')
                .select('isMonitor')
                .eq('email', verifyBy)
                .maybeSingle();

            if (!user || userError) {
                 handleError(res, `O usuário com o email ${verifyBy} não foi encontrado.`, 404, 'Usuário não encontrado');
                return;
            }

            if (!user.isMonitor) {
                 handleError(res, `O usuário com o email ${verifyBy} não é um monitor.`, 400, 'Usuário não é monitor');
                return;
            }

            const { data: receita, error } = await supabase
                .from('receitas')
                .update({
                    isVerify: true,
                    verifyBy: verifyBy,
                    ultimaAlteracao: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!receita)  handleError(res, 'Receita não encontrada', 404);
            return;

             res.json({
                message: 'Receita verificada com sucesso',
                data: receita
            });
            return;*/
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();
            const user: PrismaUsuarioRepository = new PrismaUsuarioRepository();
            const { verifyBy } = req.params;
            const { id, email } = req.params;

            if (!verifyBy) {
                return handleError(res, `O campo 'verifyBy' é obrigatório.`, 400, 'Input inválido');
            }

            const users = await user.findByEmail({ email });

            if (!users) {
                return handleError(res, `O usuário com o email ${verifyBy} não foi encontrado.`, 404, 'Usuário não encontrado');
            }

            if (!users.is_monitor) {
                return handleError(res, `O usuário com o email ${verifyBy} não é um monitor.`, 400, 'Usuário não é monitor');
            }

            const receitaAtualizada = await recipe.update(
                id,
                {
                    is_verify: true,
                    verify_by: verifyBy,
                    data_alteracao: new Date()
                }
            );

            if (!receitaAtualizada) {
                return handleError(res, 'Receita não encontrada', 404);
            }

            res.json({
                message: 'Receita verificada com sucesso',
                data: receitaAtualizada
            });
        } catch (e) {
            if (e instanceof Error) {
            handleError(res, e.message);
            return;
            }
        }
    }

    async getAllVerifiedByTheme(req:Request, res:Response): Promise<void> {
        try {
            /*const { tema } = req.params;
            if (!TEMAS_VALIDOS.includes(tema)) {
                 handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
                return;
            }
            const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoReceitas')
                .select('idReceita')
                .eq('tema', tema);
                

            if (idPostError)  handleError(res, idPostError.message, 500, idPostError.details);
            if (!idPost) handleError(res, 'Nenhuma receita encontrada', 404);

            const { data: receitas, error } = await supabase
                .from('receitas')
                .select()
                .in('id', idPost.map(post => post.idReceita))
                .eq('isVerify', true);
            if (error)  handleError(res, error.message, 500, error.details);
            const receitasComDetalhes = await Promise.all(receitas.map(async (receita) => {
                const subtemas = new Set();

                receita.correlacaoReceitas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.isVerify,
                    idUsuario: receita.idUsuario,
                    verifyBy: receita.verifyBy,
                    dataCriacao: receita.dataCriacao,
                    ultimaAlteracao: receita.ultimaAlteracao,
                    tema: receita.correlacaoReceitas?.[0]?.tema,
                    subtemas: Array.from(subtemas),
                    fotos: receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || []
                };
            }));

             res.json(receitasComDetalhes);
             return;*/

            const { tema } = req.params;
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}`, 400,'Input inválido');
            }

            const receitas = await recipe.findAllVerifiedByTheme(tema);

            if (!receitas.length) {
                return handleError(res, 'Nenhuma receita encontrada', 404);
            }

            const receitaComDetalhes = receitas.map(receita => {
                // Depois, analisar para ver se está tudo certo
                const subtemasSet = new Set(
                    receita.receitas_subtemas.map(rel => rel.subtema_id)
                )

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.is_verify,
                    idUsuario: receita.usuario_id,
                    verifyBy: receita.verify_by,
                    dataCriacao: receita.data_criacao,
                    ultimaAlteracao: receita.data_alteracao,
                    tema: tema,
                    subtemas: Array.from(subtemasSet),
                    fotos: receita.image_source ? [receita.image_source] : []
                }
            });
        } catch (e) {
            if (e instanceof Error) {
             handleError(res, e.message);
             return;
            }
        }
    }

    async getAllNotVerifiedByTheme(req:Request, res:Response): Promise<void> {
        try {
            /*const { tema } = req.params;
            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }
            const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoReceitas')
                .select('idReceita')
                .eq('tema', tema);

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            const { data: receitas, error } = await supabase
                .from('receitas')
                .select()
                .in('id', idPost.map(post => post.idReceita))
                .eq('isVerify', false);
            if (error) return handleError(res, error.message, 500, error.details);
            const receitasComDetalhes = await Promise.all(receitas.map(async (receita) => {
                const subtemas = new Set();

                receita.correlacaoReceitas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.isVerify,
                    idUsuario: receita.idUsuario,
                    verifyBy: receita.verifyBy,
                    dataCriacao: receita.dataCriacao,
                    ultimaAlteracao: receita.ultimaAlteracao,
                    tema: receita.correlacaoReceitas?.[0]?.tema,
                    subtemas: Array.from(subtemas),
                    fotos: receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || []
                };
            }));

             res.json(receitasComDetalhes);
             return;
             */

            const { tema } = req.params;
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}`, 400,'Input inválido');
            }

            const receitas = await recipe.findAllNotVerifiedByTheme(tema);
            
            if (!receitas.length) {
                return handleError(res, 'Nenhuma receita encontrada', 404);
            }

            const receitaComDetalhes = receitas.map((receita) => {

                // Depois, analisar para ver se isso está funcionando
                const subtemasSet = new Set(
                    receita.receitas_subtemas.map(rel => rel.subtema_id)
                )

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.is_verify,
                    idUsuario: receita.usuario_id,
                    verifyBy: receita.verify_by,
                    dataCriacao: receita.data_criacao,
                    ultimaAlteracao: receita.data_alteracao,
                    tema: tema,
                    subtemas: Array.from(subtemasSet),
                    fotos: receita.image_source ? [receita.image_source] : []
                }
            });

            res.json(receitaComDetalhes)
        } catch (e) {
            if (e instanceof Error) {
            return handleError(res, e.message);
            }
        }
    }
    
    async getAllByTheme(req:Request, res:Response): Promise<void> {
        try {
            /*const { tema } = req.params;
            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`, 400, 'Input inválido');
            }
            const { data: idPost, error: idPostError } = await supabase
                .from('correlacaoReceitas')
                .select('idReceita')
                .eq('tema', tema);

            if (idPostError) return handleError(res, idPostError.message, 500, idPostError.details);
            if (!idPost) return handleError(res, 'Nenhuma receita encontrada', 404);

            const { data: receitas, error } = await supabase
                .from('receitas')
                .select('*, correlacaoReceitas(tema, subtema), fotosReceitas(url)')
                .in('id', idPost.map(post => post.idReceita));

            if (error) return handleError(res, error.message, 500, error.details);
            const receitasComDetalhes = await Promise.all(receitas.map(async (receita) => {
                const subtemas = new Set();

                receita.correlacaoReceitas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.isVerify,
                    idUsuario: receita.idUsuario,
                    verifyBy: receita.verifyBy,
                    dataCriacao: receita.dataCriacao,
                    ultimaAlteracao: receita.ultimaAlteracao,
                    tema: receita.correlacaoReceitas?.[0]?.tema,
                    subtemas: Array.from(subtemas),
                    fotos: receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || []
                };
            }));

             res.json(receitasComDetalhes);
             return;*/

             const { tema } = req.params;
             const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();

            if (!TEMAS_VALIDOS.includes(tema)) {
                return handleError(res, `O tema ${tema} não é um tema válido. Temas válidos: ${TEMAS_VALIDOS.join(', ')}.`,
                400,
                'Input inválido');    
            }

            const receitas = await recipe.findAllByTheme(tema);

            const receitaComDetalhes = receitas.map((receita) => {
                const subtemasSet = new Set(
                    receita.receitas_subtemas.map(rel => rel.subtema_id)
                );

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.is_verify,
                    idUsuario: receita.usuario_id,
                    verifyBy: receita.verify_by,
                    dataCriacao: receita.data_criacao,
                    ultimaAlteracao: receita.data_alteracao,
                    tema: tema,
                    subtemas: Array.from(subtemasSet),
                    fotos: receita.image_source ? [receita.image_source] : []
                };
            });

            res.json(receitaComDetalhes);
        } catch (e) {
            if (e instanceof Error) {
            return handleError(res, e.message);
            }
        }
    }

    async getReceitasPorSubtemas(req:Request, res:Response): Promise<void> {
        try {
            /*const tema = req.params.tema;
            const subtemas = req.params.subtema.split(',');

            const subtemasQuery = subtemas.map(subtema => `subtema.eq.${subtema}`).join(',');

            const { data: correlacoes, error: correlacaoError } = await supabase
                .from('correlacaoReceitas')
                .select()
                .eq("tema", tema)
                .or(subtemasQuery);

            if (correlacaoError) {
                console.error('Erro ao buscar correlações:', correlacaoError);
                 res.status(500).json({ error: `Erro ao buscar correlações de receitas: ${correlacaoError.message}` });
                 return;
            }

            if (!correlacoes || correlacoes.length === 0) {
                 res.status(200).json([]);
                 return;
            }

            const idsReceitas = [...new Set(correlacoes.map(correlacao => correlacao.idReceita))];
            if (idsReceitas.length === 0) {
                 res.status(200).json([]);
                 return;
            }

            const { data: receitas, error: receitasError } = await supabase
                .from('receitas')
                .select('*, correlacaoReceitas(tema, subtema), fotosReceitas(url)')
                .in('id', idsReceitas)
                .eq('isVerify', true);

            if (receitasError) {
                console.error('Erro ao buscar receitas:', receitasError);
                 res.status(500).json({ error: `Erro ao buscar as receitas: ${receitasError.message}` });
                 return;
            }

            const receitasComDetalhes = await Promise.all(receitas.map(async (receita) => {
                const subtemas = new Set();

                receita.correlacaoReceitas?.forEach((correlacao: Correlacao) => {
                    if (correlacao.subtema) subtemas.add(correlacao.subtema);
                });

                return {
                    id: receita.id,
                    titulo: receita.titulo,
                    conteudo: receita.conteudo,
                    isVerify: receita.isVerify,
                    idUsuario: receita.idUsuario,
                    verifyBy: receita.verifyBy,
                    dataCriacao: receita.dataCriacao,
                    ultimaAlteracao: receita.ultimaAlteracao,
                    tema: receita.correlacaoReceitas?.[0]?.tema,
                    subtemas: Array.from(subtemas),
                    fotos: receita.fotosReceitas?.map((foto: { url: string }) => foto.url) || []
                };
            }));

            res.json(receitasComDetalhes);
            return;*/

            const tema = req.params.tema;
            const subtema = req.params.subtema.split(',');
            const recipe: PrismaReceitaRepository = new PrismaReceitaRepository();

            if (!tema || !subtema.length) {
                handleError(res, 'Tema e subtemas são obrigatórios', 400);
            }

            const receitas = await recipe.getReceitasPorSubtemas(tema, subtema);

            const formatadas = receitas.map((receita) => {
                
                // Depois, analisar para ver se está tudo certo
                const subtemasSet = new Set(
                    receita.receitas_subtemas.map((rel) => rel.subtema_id)
                );

                return {
                id: receita.id,
                titulo: receita.titulo,
                conteudo: receita.conteudo,
                isVerify: receita.is_verify,
                idUsuario: receita.usuario_id,
                verifyBy: receita.verify_by,
                dataCriacao: receita.data_criacao,
                ultimaAlteracao: receita.data_alteracao,
                subtemas: Array.from(subtemasSet),
                fotos: receita.image_source ? [receita.image_source] : []
            }
            });

            
        }
        catch (e) {
            console.error('Erro ao buscar receitas por subtemas:', e);
            if (e instanceof Error) {
             res.status(500).json({ error: `Erro interno ao processar a solicitação: ${e.message}` });
             return;
            }
        }
    }
}

function handleError(res:Response, detail = 'Ocorreu um erro.', status = 500, DetaInter?: string): never {
    console.error('Erro:',  DetaInter || detail);
    if (!res.headersSent) {
        res.status(status).json({
            message: 'Erro',
            detail
        });
    }
    throw new Error(detail);
}

export default new ReceitaController();
