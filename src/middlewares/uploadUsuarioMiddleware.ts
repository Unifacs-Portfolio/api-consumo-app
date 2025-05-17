import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

let userStorage = multer.memoryStorage();
let userUpload = multer({
    storage: userStorage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Somente arquivos de imagem são permitidos'));
        }
    }
}).single('Foto.usu');

export default userUpload;
