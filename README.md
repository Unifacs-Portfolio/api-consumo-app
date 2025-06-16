# API Multi-App

Esta é uma API RESTful desenvolvida em Node.js utilizando o framework Express para gerenciar dados de cinco diferentes aplicativos: moda, culinária, engenharia, estética e veterinária. Esta API permite o cadastro de usuários, gerenciamento de postagens e integração entre os diferentes apps.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento back-end.
- **Express**: Framework web para criar a API RESTful.
- **PostgreSQL**: Banco de dados relacional.
- **Prisma**: ORM para gerenciamento do banco de dados
- **JWT (JsonWebToken)**: Autenticação e segurança de rotas.
- **Jest**: Framework de testes unitários e de integração.
- **Supabase**: Armazenamento de arquivos e gerenciamento de banco de dados
- **Zod**: Validação de schemas
- **Swagger**: Documentação da API.

## Estrutura de Pastas

```bash
api-consumo-app/                   # Diretório raiz do projeto
│
├── /node_modules                  # Dependências instaladas via npm/yarn
│
├── /prisma                        # Configuração e migrações do Prisma ORM
│   ├── /migrations                # Histórico de migrações do banco de dados
│   └── schema.prisma              # Definição do schema do banco de dados
│
├── /src                           # Diretório do código fonte
│   │
│   ├── /controller                # Manipuladores de requisições e lógica de negócio
│   │   ├── authController.ts      # Lógica de autenticação e autorização
│   │   ├── recipeController.ts    # Lógica de gerenciamento de receitas
│   │   └── usuarioController.ts   # Lógica de gerenciamento de usuários
│   │
│   ├── /database                  # Configuração e conexões do banco de dados
│   │   └── client.ts              # Configuração da instância do cliente Prisma
│   │
│   ├── /interfaces                # Interfaces e tipos do TypeScript
│   │   └── auth.interface.ts      # Interfaces relacionadas à autenticação
│   │
│   ├── /middleware                # Funções de middleware do Express
│   │   └── auth.middleware.ts     # Middleware de autenticação
│   │
│   ├── /routes                    # Definições das rotas da API
│   │   ├── authRoutes.ts          # Rotas de autenticação
│   │   ├── recipeRoutes.ts        # Rotas de gerenciamento de receitas
│   │   └── usuarioRoutes.ts       # Rotas de gerenciamento de usuários
│   │
│   ├── /utils                     # Funções utilitárias e auxiliares
│   │   └── jwt.utils.ts           # Utilitários para manipulação de JWT
│   │
│   ├── app.ts                     # Configuração do aplicativo Express
│   └── server.ts                  # Ponto de entrada do servidor
│
├── .env                           # Variáveis de ambiente
├── .gitignore                     # Regras de ignorar arquivos do Git
├── package-lock.json              # Arquivo de bloqueio de dependências
├── package.json                   # Metadados do projeto e dependências
├── README.md                      # Documentação do projeto
└── tsconfig.json                  # Configuração do TypeScript
```

## Pré-requisitos

Antes de iniciar, certifique-se de ter o seguinte instalado:

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL
- Conta no Supabase

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Unifacs-Portfolio/api-consumo-app.git
cd api-consumo-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta
```

4. Execute as migrações do banco de dados:
```bash
npx sequelize db:migrate
```

5. Inicie a aplicação:
```bash
npm run dev
```
A aplicação estará disponível em http://localhost:3000.

## Executando a Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## Rotas da API

### Usuários
- `POST /api/users/register` - Cadastro de usuários
- `POST /api/users/login` - Autenticação
- `GET /api/users` - Lista usuários

### Receitas
- `GET /api/receitas` - Lista todas as receitas
- `POST /api/receitas` - Cria nova receita
- `PUT /api/receitas/:id` - Atualiza receita
- `DELETE /api/receitas/:id` - Remove receita
- `PATCH /api/receitas/:id/verificar` - Verifica receita

### Temas e Subtemas
- `GET /api/:tema/receitas` - Lista receitas por tema
- `GET /api/receitas/:tema/:subtema` - Lista receitas por tema e subtema

### Autenticação
Esta API utiliza autenticação via JWT (JSON Web Token) para proteger rotas. O fluxo básico é:

1. Registro de Usuário:
-Endpoint: POST /auth/register
-Descrição: Cadastra um novo usuário.
-Exemplo de corpo da requisição:
```json
{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "123456"
}
```

2. Login de Usuário:
-Endpoint: POST /auth/login
-Descrição: Autentica o usuário e retorna um token JWT.
-Exemplo de corpo da requisição:
```json
{
  "email": "joao@example.com",
  "senha": "123456"
}
```
-Exemplo de resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Como usar o token:
Inclua o token no header das requisições protegidas:
```makefile
Authorization: Bearer SEU_TOKEN_AQUI
```

Exemplo com curl:
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:3000/users
```

4. Endpoints protegidos (requere token JWT)
4.1 Usuários
-GET /users — Lista todos os usuários
-GET /users/:id — Retorna dados de um usuário específico
-PUT /users/:id — Atualiza os dados de um usuário
-DELETE /users/:id — Remove um usuário

4.2 Postagens
-GET /posts — Lista todas as postagens
-POST /posts — Cria nova postagem
-PUT /posts/:id — Atualiza uma postagem
-DELETE /posts/:id — Deleta uma postagem

5. Dicas, Ingredientes e Temas
Rotas seguem o mesmo padrão de CRUD (GET, POST, PUT, DELETE) e estão organizadas por categoria (moda, culinária, estética, etc), conforme o escopo do projeto.

## Teste
```bash
# Executa todos os testes
npm test

# Executa testes com coverage
npm run test:coverage
```

## Documentação da API

A documentação da API é gerada automaticamente utilizando o Swagger. Após iniciar o servidor, acesse a documentação via:

http://localhost:3000/docs


## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request