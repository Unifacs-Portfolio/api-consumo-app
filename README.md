# API Multi-App

Esta é uma API RESTful desenvolvida em Node.js utilizando o framework Express para gerenciar dados de cinco diferentes aplicativos: moda, culinária, engenharia, estética e veterinária. Esta API permite o cadastro de usuários, gerenciamento de postagens e integração entre os diferentes apps.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento back-end.
- **Express**: Framework web para criar a API RESTful.
- **PostgreSQL**: Banco de dados relacional.
- **JWT (JsonWebToken)**: Autenticação e segurança de rotas.
- **Jest**: Framework de testes unitários e de integração.
- **Swagger**: Documentação da API.

## Estrutura de Pastas

```bash
api-consumo-app/
├── docs/             # Documentação da API (Swagger)
├── migrations/       # Arquivos de migração do banco de dados
├── src/
│   ├── config/       # Configurações da aplicação (como o banco de dados)
│   ├── controllers/  # Lógica de controle das requisições
│   ├── models/       # Definição dos modelos de dados (ORM)
│   ├── routes/       # Definição das rotas da API
│   ├── middlewares/  # Middlewares para validações e autenticação
│   ├── utils/        # Funções utilitárias e helpers
│   ├── tests/        # Testes unitários e de integração
│   └── app.js        # Arquivo principal da aplicação
├── .env              # Variáveis de ambiente (senhas, chaves, etc.)
├── .gitignore        # Arquivos e pastas ignorados pelo Git
├── package.json      # Dependências e scripts npm
├── package-lock.json # Lockfile do npm
├── vercel.json       # Configuração para deploy na Vercel
└── README.md         # Documentação do projeto
```

## Pré-requisitos

Antes de iniciar, certifique-se de ter o seguinte instalado:

- Node.js (v14 ou superior)
- npm ou yarn
- PostgreSQL

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

## Rotas da API

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
npm test
```

## Documentação da API

A documentação da API é gerada automaticamente utilizando o Swagger. Após iniciar o servidor, acesse a documentação via:

http://localhost:3000/docs


## Contribuição

1. Faça um fork do projeto.

2. Crie uma branch para a sua feature (git checkout -b feature/nova-feature).

3. Faça o commit das suas alterações (git commit -m 'Adiciona nova feature').

4. Envie para a branch principal (git push origin feature/nova-feature).

5. Abra um Pull Request.