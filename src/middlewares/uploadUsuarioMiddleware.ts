import type { Request } from 'express'
import multer, { type FileFilterCallback } from 'multer'

const userStorage = multer.memoryStorage()
const userUpload = multer({
    storage: userStorage,
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Somente arquivos de imagem são permitidos'))
        }
    },
}).single('Foto.usu')

export default userUpload
