import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'A variável de ambiente DATABASE_URL é obrigatória',
    invalid_type_error: 'A variável de ambiente DATABASE_URL deve ser uma string',
  }).url(),

  DIRECT_URL: z.string({
    required_error: 'A variável de ambiente DIRECT_URL é obrigatória',
    invalid_type_error: 'A variável de ambiente DIRECT_URL deve ser uma string',
  }).url(),

  JWT_SECRET: z.string({
    required_error: 'A variável de ambiente JWT_SECRET é obrigatória',
    invalid_type_error: 'A variável de ambiente JWT_SECRET deve ser uma string',
  }).nonempty({
    message: 'A variável de ambiente JWT_SECRET não pode ser vazia',
  }),
  
  EMAIL_USER: z.string({
    required_error: 'A variável de ambiente EMAIL_USER é obrigatória',
    invalid_type_error: 'A variável de ambiente EMAIL_USER deve ser uma string',
  }).optional(),

  EMAIL_PASS: z.string({
    required_error: 'A variável de ambiente EMAIL_PASS é obrigatória',
    invalid_type_error: 'A variável de ambiente EMAIL_PASs deve ser uma string',
  }).optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string({
    required_error: 'A variável de ambiente NEXT_PUBLIC_SUPABASE_URL é obrigatória',
    invalid_type_error: 'A variável de ambiente NEXT_PUBLIC_SUPABASE_URL deve ser uma string',
  }).url(),

  NEXT_PUBLIC_SUPABASE_KEY: z.string({
    required_error: 'A variável de ambiente NEXT_PUBLIC_SUPABASE_KEY é obrigatória',
    invalid_type_error: 'A variável de ambiente NEXT_PUBLIC_SUPABASE_KEY deve ser uma string',
  })
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Erro na validação das variáveis de ambiente do servidor',_env.error.format())
  process.exit(1)
}

export const serverEnv = _env.data