import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import dicasRoutes from './routes/dicaRoutes';
import temaRoutes from './routes/temaRoutes';
import receitaRoutes from './routes/receitaRoutes';

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
                url: 'https://api-app-seven-chi.vercel.app/',
                description: 'Ambiente de Produção',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
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
// this.app.use('/api', ingredientesRoutes);

export { app }
