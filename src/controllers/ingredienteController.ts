import Ingrediente from '../models/Ingrediente.ts';
import { supabase } from '../supabase/client.ts';
import { Request, Response } from 'express';

class IngredienteController {

    async store(req:Request, res:Response) {
        try {
            const ingrediente = new Ingrediente(req.body);

            const { valid, errors } = ingrediente.validate();

            if (!valid) {
                handleError(res, errors ?.join(', ') || '', 400, 'Ingrediente Inválido');
            }

            const { postagemId } = req.body;

            if (!postagemId) throw new Error('postagemId é obrigatório');

            const { data, error } = await ingrediente.save(postagemId);

            return res.status(201).json({ message: 'Ingrediente adicionado com sucesso', data: data });

        } catch (e) {
            handleError(res, String(e))
        }
    }

    async index(req:Request, res:Response) {
        try {
            const { data: ingredientes, error } = await supabase
                .from('ingredientes')
                .select('nomeingrediente, quantidade, medida');

            if (error) throw error;

            return res.json(ingredientes);

        } catch (e) {
            if (e instanceof Error) {
            handleError(res, e.message)
            }
        }

    }


    async show(req:Request, res:Response) {
        try {
            const { data: ingrediente, error } = await supabase
                .from('ingredientes')
                .select()
                .eq('ingrediente_id', req.params.ingredienteId)
                .single();

            if (error || !ingrediente) {
                handleError(res, `O ingrediente com o Id ${req.params.ingredienteId} não foi encontrado.`, 404, 'Ingrediente não encontrado')
            }

            return res.json(ingrediente);
        } catch (e) {
             if (e instanceof Error) {
            handleError(res, e.message);
             }
        }
    }

    async update(req:Request, res:Response) {
        try {
            const updateIngrediente = new Ingrediente(req.body);

            const { valid, errors } = updateIngrediente.validate();

            const { data: updatedIngrediente, error: updateError } = await supabase
                .from('ingredientes')
                .update([{
                    nomeIngrediente: updateIngrediente.nomeIngrediente,
                    quantidade: updateIngrediente.quantidade,
                    medida: updateIngrediente.medida,
                }])
                .eq('ingrediente_id', req.params.ingredienteId)
                .select();
            if (!valid) {
                return res.status(400).json({ message: 'Esse ingrediente não é válido', errors: errors });
            }

            if (updateError) throw updateError;

            if (!updatedIngrediente) {
                handleError(res, `O ingrendiente com o id ${req.params.ingredienteId} não foi encontrado.`, 404, 'Ingrediente não encontrado')
            }

            return res.status(200).json({ message: 'Ingrediente atualizado com sucesso', data: updatedIngrediente[0] });

        } catch (e) {
             if (e instanceof Error) {
            handleError(res, e.message);
             }
        }
    }

    async delete(req:Request, res:Response) {
        try {
            const { data, error: deleteError } = await supabase
                .from('ingredientes')
                .delete()
                .eq('ingrediente_id', req.params.ingredienteId)
                .select();

            if (deleteError) throw deleteError;

            if (!data) {
                handleError(res, `O ingrendiente com o id ${req.params.ingredienteId} não foi encontrado.`, 404, 'Ingrediente não encontrado')
            }

            return res.status(204).end();

        } catch (e) {
             if (e instanceof Error) {
            handleError(res, e.message)
            }
        }
    }
}

function handleError(res:Response, detail = 'An error has occurred.', status = 500, message = 'Internal Server Error') {
    if (!res.headersSent) {
        return res.status(status).json({ message: message, detail: detail });
    }
}

export default new IngredienteController(); 