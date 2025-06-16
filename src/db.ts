import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis de ambiente do Supabase não estão definidas.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
export const prisma = new PrismaClient()
