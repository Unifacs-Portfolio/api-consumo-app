import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import dotenv from 'dotenv'
import type { UserJwtPayload } from '../types/user-jwt-payload'

dotenv.config()
declare global {
    namespace Express {
        interface Request {
            user: UserJwtPayload
        }
    }
}

const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido' })
        return
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
        res.status(401).json({ error: 'Token mal formatado' })
        return
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ error: 'Token mal formatado' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = decoded as UserJwtPayload
        next()
    } catch (_error) {
        res.status(400).json({
            message: 'Token inválido ou erro de autenticação',
        })
    }
}
export default authMiddleware
