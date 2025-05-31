import dotenv from 'dotenv'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

dotenv.config()
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers[authorization]
    if (!token) {
        res.status(401).json({ message: 'Token não fornecido' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = decoded as JwtPayload
        next()
    } catch (error) {
        res.status(400).json({
            message: 'Token Inválido ou erro de autenticação',
        })
    }
}
export default authMiddleware
