import User from '../models/User';
import { supabase } from '../supabase/client';
import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import type { Request, Response } from 'express';
import { error } from 'console';
import { PrismaUsuarioRepository } from '../repositories/prisma/PrismaUsuarioRepository';

    const userPrismaRepository = new PrismaUsuarioRepository();

    export async function storeUser(req:Request, res:Response): Promise<void> {
        let uploadedImagePath = null;
        try {
            const user = new User({
                email: req.body.email,
                tokens: req.body.tokens,
                senha: req.body.senha,
                nome: req.body.nome,
                telefone: req.body.telefone,
                nivelConsciencia: req.body.nivelConsciencia,
                isMonitor: req.body.isMonitor,
                fotoUsu: ''
            });

            const { valid, errors } = user.validate();

            if (!valid){
                res.status(400).json({ errors });
                return;
            }  

            let fotoUsuarioURL: string | null = null;

            // Se a imagem foi carregada
            if (req.file) {

                const uploadResult = await uploadImage(req.file);                
                
                if (!uploadResult) {
                    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
                    return;
                }
                fotoUsuarioURL = uploadResult.url;
                uploadedImagePath = uploadResult.path;
            }

            // O hash da senha é gerado aqui
            const hashedPassword = await argon2.hash(user.senha);

            await userPrismaRepository.create({
                email: user.email,
                senha: hashedPassword,
                nome: user.nome,
                telefone: user.telefone,
                nivel_consciencia: user.nivelConsciencia,
                is_monitor: user.isMonitor,
                tokens: user.tokens,
                foto_usuario: fotoUsuarioURL ?? '' //Não a variável sem definicao
            })

            res.status(201).json({ message: 'Usuário criado com sucesso' });
            return;

        } catch (e) {
            if (uploadedImagePath) {
                await supabase.storage
                    .from('fotoPerfil')
                    .remove([uploadedImagePath]);
            }
            if (e instanceof Error) {
             res.status(400).json({ errors: [e.message] });
             return;
            }
        }
    }

    //funcionando pos alteracao bd
    export async function indexUser(req:Request, res:Response): Promise<void> {
        try {
            /*const { data: users, error } = await supabase
                .from('usuarios')
                .select('email, nome, telefone, nivelConsciencia, isMonitor, fotoUsu');

            if (error) throw error;

             res.json(users);
             return;*/

             const users = await userPrismaRepository.findAll();

             const sanitizedUsers = users.map(user =>({
                email: user.email,
                nome: user.nome,
                telefone: user.telefone,
                nivel_consciencia: user.nivel_consciencia,
                isMonitor: user.is_monitor,
                foto_usuario: user.foto_usuario
             }));

             res.json(sanitizedUsers);
        } catch (e) {
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] });
             return;
            }
        }
    }
    //funcionando pos alteracao bd
    export async function showUser(req:Request, res:Response): Promise<void> {
        try {
            /*const { data: user, error } = await supabase
                .from('usuarios')
                .select('email, nome, telefone, nivelConsciencia, isMonitor, fotoUsu')
                .eq('email', req.params.email)
                .single();

            if (error || !user) {
                 res.status(404).json({ errors: ['Usuário não encontrado'] });
                 return;
            }

             res.json(user);
             return;*/
              const user = await userPrismaRepository.findByEmail({ email: req.params.email });

                if (!user) {
                    res.status(404).json({ errors: ['Usuário não encontrado'] });
                    return;
                }

                res.json({
                    email: user.email,
                    nome: user.nome,
                    telefone: user.telefone,
                    nivel_consciencia: user.nivel_consciencia,
                    isMonitor: user.is_monitor,
                    foto_usuario: user.foto_usuario
                });

        } catch (e) {
            if (e instanceof Error) {
             res.status(400).json({ errors: [e.message] });
             return;
            }
        }
    }
    //Funcionando pos alteracao
    export async function updateUser(req:Request, res:Response): Promise<void> {

        let uploadedImagePath = null;

        try {
            /*const { data: user, error: fetchError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', req.params.email)
                .single();
    
            if (fetchError || !user) {
                res.status(400).json({ errors: ['Usuário não encontrado'] });
                return;
            }
    
            let fotoUsuarioURL = user["Foto.usu"];
    
            if (req.file) {
                const uploadResult = await uploadImage(req.file);
                
            if (!uploadResult) {
              res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
              return;
            }

                fotoUsuarioURL = uploadResult.url;
                uploadedImagePath = uploadResult.path;
            }
    
            // Prepare the data to be updated
            const updatedData = { ...req.body, fotoUsu: fotoUsuarioURL };
    
            // Verificação e hash da senha
            if (req.body.senha) {  // Use 'senha' em minúsculas
                console.log("Hashing a senha...");
                updatedData.senha = await argon2.hash(req.body.senha.trim());  // 'senha' em minúsculas
            }
    
            const { error: updateError } = await supabase
                .from('usuarios')
                .update(updatedData)
                .eq('email', req.params.email);
    
            if (updateError) throw updateError;
    
            res.json({ message: 'Usuário atualizado com sucesso' });
            return;*/
            const userEmail = req.params.email;

            const user = await userPrismaRepository.findByEmail({ email: userEmail });

            if (!user) {
                res.status(400).json({ errors: ['Usuário não encontrado'] });
                return;
            }

            let fotoUsuarioURL = user.foto_usuario;

            if (req.file) {
                const uploadResult = await uploadImage(req.file);
                if (!uploadResult) {
                    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
                    return;
                }

                fotoUsuarioURL = uploadResult.url;
                uploadedImagePath = uploadResult.path;
            }

            const updatedData = { email: userEmail, ...req.body, foto_usuario: fotoUsuarioURL }; // usa o operador spread (...) para copiar todas as propriedades de req.body

            if (req.body.senha) {
                updatedData.senha = await argon2.hash(req.body.senha.trim());
            }

            await userPrismaRepository.updateOne(updatedData);

            res.json({ message: 'Usuário atualizado com sucesso' });
    
        } catch (e) {
            if (e instanceof Error) {
            console.error("Erro ao atualizar usuário:", e.message);
            }
    
            if (uploadedImagePath) {
                await supabase.storage.from('fotoPerfil').remove([uploadedImagePath]);
            }
            if (e instanceof Error) {
                res.status(400).json({ errors: [e.message] });
                return;
            }
        }
    }
        
    // Funcionando pos alteracao
    export async function deleteUser(req:Request, res:Response): Promise<void> {
        try {
            /*const { data: user, error: fetchError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', req.params.email)
                .single();

            if (fetchError || !user) {
                 res.status(400).json({ errors: ['Usuário não encontrado'] });
                 return;
            }

            const { error: deleteError } = await supabase
                .from('usuarios')
                .delete()
                .eq('email', req.params.email);

            if (deleteError) throw deleteError;

             res.json({ message: 'Usuário deletado com sucesso' });
             return;*/
             const user = await userPrismaRepository.findByEmail({email: req.params.email});

             if(!user){
                res.status(400).json({errors: ['Usuário não encontrado']});
                return;
             }

             await userPrismaRepository.delete({email: req.params.email});

             res.json({message: 'Usuário deletado com sucesso'});

        } catch (e) {
            if (e instanceof Error) {
            res.status(400).json({ errors: [e.message] });
            return;
            }
        }
    }

    export async function loginUser(req:Request, res:Response): Promise<void> {
        const { email, senha } = req.body;
    
        try {
            //console.log("Iniciando login para o email:", email);
    
            /*const { data: user, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single();
    
            if (error || !user) {
                console.error("Erro ao buscar usuário ou usuário não encontrado:", error);
                 res.status(400).json({ error: 'Usuário não encontrado ou erro na busca' });
                 return;
            }
    
            console.log("Usuário encontrado:", user);
            if (!user.senha || !user.senha.startsWith('$')) {
                console.error("Senha inválida ou não é um hash no banco de dados.");
                 res.status(500).json({ error: 'Erro no registro do usuário' });
                 return;
            }
    
            const validPassword = await argon2.verify(user.senha, senha);
    
            if (!validPassword) {
                console.error("Senha inválida para o usuário:", email);
                res.status(401).json({ error: 'Credenciais inválidas' });
                return;
            }
    
            console.log("Senha verificada com sucesso. Gerando token...");
    
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string
            );
    
            console.log("Token gerado com sucesso:", token);
    
             res.status(200).json({ message: 'Login bem-sucedido', token });
             return;*/
             const user = await userPrismaRepository.findByEmail({email});

             if(!user){
                res.status(400).json({error: 'Usuário não encontrado'});
                return;
             }

             if(!user.senha || !user.senha.startsWith('$')){
                res.status(500).json({error: 'Erro no registro do usuário'});
                return;
             }

            const validPassword = await argon2.verify(user.senha, senha);

            if(!validPassword){
                res.status(401).json({error: 'Credencias inválidas'})
                return;
            }

            const token = jwt.sign(
                {userID: user.id, email: user.email},
                process.env.JWT_SECRET as string
            );

            res.status(200).json({message: 'Login bem-sucedido', token});
        } catch (e) {
            if (e instanceof Error) {
            console.error("Erro no processo de login:", e.message);
             res.status(500).json({ error: 'Erro interno do servidor' });
             return;
            }
        }
    }
    
    export async function resetPasswordRequestUser(req:Request, res:Response): Promise<void> {
        const { email } = req.body;

        try {
            /*const { data: user, error } = await supabase
                .from('usuarios')
                .select('email')
                .eq('email', email)
                .single();

            if (error || !user) {
                res.status(400).json({ error: 'Usuário não encontrado' });
                return;
            }

            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Redefinição de Senha',
                text: `Seu token de redefinição de senha é: ${token}`,
                html: `<p>Seu token de redefinição de senha é:</p><p><strong>${token}</strong></p>`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Token de redefinição de senha enviado com sucesso' });
            return;*/
            const user = await userPrismaRepository.findByEmail({ email });


            if (!user) {
                res.status(400).json({ error: 'Usuário não encontrado' });
                return;
            }

            //console.log('chegou aq2');

            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });


            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Redefinição de Senha',
                html: `<p>Seu token de redefinição de senha é:</p><p><strong>${token}</strong></p>`
            };


            await transporter.sendMail(mailOptions);


            res.status(200).json({ message: 'Token de redefinição de senha enviado com sucesso' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }
    }

    export async function resetPasswordUser(req:Request, res:Response): Promise<void> {
    
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
            const email = decoded.email;

            const hashedPassword = await argon2.hash(newPassword);

            await userPrismaRepository.updatePasswordByEmail(email, hashedPassword);

            res.status(200).json({ message: 'Senha atualizada com sucesso' });
            return;
            
           

        } catch (e) {
           /* if (error.name === 'TokenExpiredError') {
                res.status(400).json({ error: 'Token expirado' });
                return;
            } 
            
            if (error.name === 'JsonWebTokenError') {
                res.status(400).json({ error: 'Token inválido' });
                return;
            }
        
            console.error(e);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;*/

            if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ error: 'Token expirado' });
            return;
            }

            if (e instanceof jwt.JsonWebTokenError) {
                res.status(400).json({ error: 'Token inválido' });
                return;
            }

            console.error(e);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
        }
    }

    async function uploadImage(file: Express.Multer.File) { 
        try {
            const uniqueFileName = `${uuidv4()}-${file.originalname}`;
            const { data, error } = await supabase.storage
                .from('fotoPerfil')
                .upload(uniqueFileName, file.buffer, {
                    contentType: file.mimetype,
                }); 

            if (error) throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);

            const { data: publicURL } = supabase.storage
                .from('fotoPerfil')
                .getPublicUrl(data.path);

            return { url: publicURL.publicUrl, path: data.path };

        } catch (e) {
            if (e instanceof Error) {
            throw new Error(`Erro ao fazer upload da imagem: ${e.message}`);
            }
        }

    }
