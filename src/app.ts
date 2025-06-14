import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import dicasRoutes from './routes/dicaRoutes';
import temaRoutes from './routes/temaRoutes';
import receitaRoutes from './routes/receitaRoutes';
import ingredientesRoutes from './routes/ingredienteRoutes';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import quizRoutes from './routes/quizRoutes';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API APP',
            version: '1.0.0',
            description: 'Documentação da API usada para o desenvolvimento dos aplicativos ecológicos',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
                description: 'Ambiente Local backend',
            },
            {
                url: 'https://api-consumo-app.onrender.com',
                description: 'Ambiente de Produção',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
        customCss: `
                    .swagger-ui .opblock .opblock-summary-path-description-wrapper {
                        align-items: center;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0 10px;
                        padding: 0 10px;
                        width: 100%;
                    }
                `,
        customCssUrl: CSS_URL,
    })
);


app.use('/api', userRoutes);
app.use('/api', dicasRoutes);
app.use('/api', temaRoutes);
app.use('/api', receitaRoutes);
app.use('/api', ingredientesRoutes);
app.use('/api', quizRoutes);

app.use(<ErrorRequestHandler>((err, _req, res, _next) => {
    console.error(err)
    if (err instanceof ZodError) {
        res.status(400).json({ error: err.issues })
        return
    }
    if (err instanceof Error) {
        res.status(400).json({ error: err.message })
        return
    }
    res.status(500).json({ error: 'Erro interno no servidor' })
}))

export { app }
