import Ingrediente from '../models/Ingrediente';
import { PrismaIngredienteRepository } from '../repositories/prisma/PrismaIngredienteRepository';
import { supabase } from '../supabase/client';
import { Request, Response } from 'express';

class IngredienteController {

    store = async (req: Request, res: Response) => {
        try {
            const ingrediente = new Ingrediente(req.body);

            const { valid, errors } = ingrediente.validate();

            if (!valid) {
                handleError(res, errors?.join(', ') || '', 400, 'Ingrediente Inválido');
            }

            const { postagemId } = req.body;

            if (!postagemId) throw new Error('postagemId é obrigatório');

            const { data, error } = await ingrediente.save(postagemId);

            return res.status(201).json({ message: 'Ingrediente adicionado com sucesso', data: data });

        } catch (e) {
            handleError(res, String(e))
        }
    }

     listAll = async (req: Request, res: Response) => {
        try {
            /* const { data: ingredientes, error } = await supabase
                .from('ingredientes')
                .select('nomeingrediente, quantidade, medida');

            if (error) throw error; */
            const ingredienteRepository = new PrismaIngredienteRepository();
            const ingredientes = await ingredienteRepository.findAll();

            return res.json(ingredientes);

        } catch (e) {
            if (e instanceof Error) {
                handleError(res, e.message)
            }
        }

    }


    show = async (req: Request, res: Response) => {
        try {
            /* const { data: ingrediente, error } = await supabase
                .from('ingredientes')
                .select()
                .eq('ingrediente_id', req.params.ingredienteId)
                .single();

            if (error || !ingrediente) {
                handleError(res, `O ingrediente com o Id ${req.params.ingredienteId} não foi encontrado.`, 404, 'Ingrediente não encontrado')
            } */
            const ingredienteRepository = new PrismaIngredienteRepository();
            const ingrediente = await ingredienteRepository.findById(req.params.ingredienteId);
            return res.json(ingrediente);
        } catch (e) {
            if (e instanceof Error) {
                handleError(res, e.message);
            }
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const updateIngrediente = new Ingrediente(req.body);

            const { valid, errors } = updateIngrediente.validate();

            if (!valid) {
                return res.status(400).json({ message: 'Esse ingrediente não é válido', errors: errors });
            }
            /* const { data: updatedIngrediente, error: updateError } = await supabase
                .from('ingredientes')
                .update([{
                    nomeIngrediente: updateIngrediente.nomeIngrediente,
                    quantidade: updateIngrediente.quantidade,
                    medida: updateIngrediente.medida,
                }])
                .eq('ingrediente_id', req.params.ingredienteId)
                .select();

            if (updateError) throw updateError; */
            const ingredienteRepository = new PrismaIngredienteRepository();
            const updatedIngrediente = await ingredienteRepository.update(req.params.ingredienteId, {
                nome: updateIngrediente.nomeIngrediente,
                quantidade: updateIngrediente.quantidade.toString(),
                medida: updateIngrediente.medida,
            });

            if (!updatedIngrediente) {
                handleError(res, `O ingrendiente com o id ${req.params.ingredienteId} não foi encontrado.`, 404, 'Ingrediente não encontrado')
            }

            return res.status(200).json({ message: 'Ingrediente atualizado com sucesso', data: updatedIngrediente });

        } catch (e) {
            if (e instanceof Error) {
                handleError(res, e.message);
            }
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            /* const { data, error: deleteError } = await supabase
                .from('ingredientes')
                .delete()
                .eq('ingrediente_id', req.params.ingredienteId)
                .select();

            if (deleteError) throw deleteError; */
            const ingredienteRepository = new PrismaIngredienteRepository();
            await ingredienteRepository.delete(req.params.ingredienteId);

            return res.status(204).end();
        } catch (e) {
            if (e instanceof Error) {
                handleError(res, e.message)
            }
        }
    }
}

function handleError(res: Response, detail = 'An error has occurred.', status = 500, message = 'Internal Server Error') {
    if (!res.headersSent) {
        return res.status(status).json({ message: message, detail: detail });
    }
}

export const ingredienteController = new IngredienteController(); 