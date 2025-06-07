import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config();
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

const authMiddleware: RequestHandler = async(req: Request, res: Response, next: NextFunction)  =>{
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        res.status(401).json({ error: 'Token mal formatado' });
        return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ error: 'Token mal formatado' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as JwtPayload;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido ou erro de autenticação' });
    }
};
export default authMiddleware;
