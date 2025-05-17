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
    let token = req.headers['authorization'];
    if(!token) {
        res.status(401).json({ message: 'Token não fornecido'});
        return
    }

    try{    
        let decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as JwtPayload;
        next(); 
    } catch (error) {
       res.status(400).json({ message: 'Token Inválido ou erro de autenticação'});
    };
};
export default authMiddleware;
