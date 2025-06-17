// import { supabase } from '../supabase/client';
import Tema from '../models/Tema'
import type { Request, Response } from 'express'
import { PrismaTemaRepository } from '../repositories/prisma/PrismaTemaRepository'

const temaController = {
    index: async (_req: Request, res: Response): Promise<void> => {
        try {
            /* const { data, error } = await supabase.from('tema').select('*'); */
            const temaRepository = new PrismaTemaRepository()
            const temas = await temaRepository.findAll()

            res.status(200).json(temas)
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Erro no servidor',
                    details: error.message,
                })
                return
            }
        }
    },

    checkIfExists: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            const TemaDoID = Number(id)

            if (Number.isNaN(TemaDoID)) {
                res.status(400).json({ error: 'ID inválido' })
            }

            const tema = await Tema.findById(TemaDoID)
            if (!tema) {
                res.status(404).json({ exists: false })
                return
            }

            res.status(200).json({ exists: true })
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Erro no servidor',
                    details: error.message,
                })
                return
            }
        }
    },

    async getSubtemasByTema(req: Request, res: Response) {
        const tema = req.params.tema

        try {
            /* const { data: subtemasData, error } = await supabase
                .from('temaSubtema')
                .select('subtema')
                .eq('tema', tema);

            if (error) throw error; */
            const temaRepository = new PrismaTemaRepository()
            const temaExists = await temaRepository.findByName({
                nome: tema,
            })
            if (!temaExists) {
                res.status(404).json({ error: 'Tema não encontrado' })
                return
            }
            const subtemasData = await temaRepository.getSubtemasByTema({
                temaId: temaExists.id,
            })
            res.status(200).json(subtemasData)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Erro ao buscar subtemas',
                    details: error.message,
                })
            }
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            /* const { data, error } = await supabase
                .from('tema')
                .delete()
                .eq('id', id)
                .select();

            if (error) {
                res.status(500).json({ error: 'Erro ao deletar tema', details: error.message });
                return;
            } */
            const temaRepository = new PrismaTemaRepository()
            await temaRepository.delete({
                id,
            })
            /* if (!data || data.length === 0) {
                res.status(404).json({ error: `Tema com id ${id} não encontrado` });
                return;
            } */

            res.status(204).end()
            return
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    error: 'Erro no servidor',
                    details: error.message,
                })
                return
            }
        }
    },
}

export default temaController
