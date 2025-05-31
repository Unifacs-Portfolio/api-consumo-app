import dotenv from 'dotenv'
dotenv.config()

import { type SupabaseClient, createClient } from '@supabase/supabase-js'

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_KEY
) {
    throw new Error('Variáveis de ambiente do Supabase não estão definidas.')
}

export const supabase: SupabaseClient = createClient(
    supabaseUrl as string,
    supabaseKey as string,
)
