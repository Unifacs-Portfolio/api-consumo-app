# API Multi-App

Esta é uma API RESTful desenvolvida em Node.js utilizando o framework Express para gerenciar dados de cinco diferentes aplicativos: moda, culinária, engenharia, estética e veterinária. Esta API permite o cadastro de usuários, gerenciamento de postagens e integração entre os diferentes apps.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento back-end.
- **Express**: Framework web para criar a API RESTful.
- **PostgreSQL**: Banco de dados relacional.
- **Prisma**: ORM para gerenciamento do banco de dados
- **JWT (JsonWebToken)**: Autenticação e segurança de rotas.
- **Supabase**: Armazenamento de arquivos e gerenciamento de banco de dados
- **Zod**: Validação de schemas
- **Swagger**: Documentação da API.

## Estrutura de Pastas

```bash
api-consumo-app/             # Diretório raiz do projeto
├── .github/                 # Configurações específicas do GitHub (ex: workflows, templates de issues)
├── .vscode/                 # Configurações e definições do editor VS Code
├── generated/               # Arquivos gerados automaticamente (ex: código, tipos)
├── node_modules/            # Dependências instaladas pelo npm ou yarn
├── prisma/                  # Arquivos relacionados ao Prisma ORM (ex: schema, migrações)
├── src/                     # Código-fonte da aplicação
│   ├── controllers/         # Lida com requisições recebidas e orquestra as respostas
│   ├── middlewares/         # Funções que são executadas antes ou depois dos manipuladores de rota
│   ├── models/              # Define as estruturas de dados e interage com o banco de dados
│   ├── repositories/        # Camada de abstração para acesso a dados (ex: operações de banco de dados)
│   ├── routes/              # Define os endpoints da API e seus respectivos manipuladores
│   ├── utils/               # Funções utilitárias e módulos auxiliares
│   ├── app.ts               # Ponto de entrada principal da aplicação (ex: instância do aplicativo Express)
│   ├── db.ts                # Conexão e configuração do banco de dados
│   └── server.ts            # Configura e inicia o servidor da aplicação
├── .env                     # Variáveis de ambiente (local - geralmente não é commitado)
├── .env.example             # Exemplo das variáveis de ambiente necessárias para o projeto
├── .gitignore               # Especifica arquivos intencionalmente não rastreados para ignorar pelo Git
├── biome.json               # Configuração para Biome (formatador/linter/etc.)
├── package-lock.json        # Garante que as dependências instaladas sejam consistentes entre diferentes ambientes
├── package.json             # Metadados do projeto e definições de scripts
├── README.md                # Arquivo README do projeto
└── tsconfig.json            # Configuração do compilador TypeScript
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
Crie um arquivo .env na raiz do projeto tendo como EXEMPLO as seguintes variáveis:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_KEY="your-anon-public-key"
JWT_SECRET="a_very_strong_and_random_secret_key"
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password-or-app-key"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma generate
```

4.1 Caso queira visualizar o banco de dados pelo prisma o comando é:
```bash
npx prisma studio
```

## Executando a Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## Rotas da API

### Documentação da API

A documentação da API é gerada automaticamente utilizando o Swagger. Após iniciar o servidor, acesse a documentação via:

https://api-consumo-app.onrender.com/api-docs/

### Dicas
- `GET /api/dicas` - Lista todas as dicas
- `POST /api/dicas` - Cria uma nova dica
- `PUT /api/dicas/{id}` - Atualiza uma dica
- `GET /api/dicas/{id}` - Obtém uma dica pelo ID
- `DELETE /api/dicas/{id}` - Deleta uma dica pelo ID
- `PATCH /api/dicas/{id}/verificar` - Verifica uma dica
- `GET /api/{tema}/dicas` - Lista dicas por tema
- `GET /api/{tema}/dicas/verificadas` - Lista dicas verificadas por tema
- `GET /api/{tema}/dicas/nao-verificadas` - Lista dicas não verificadas por tema
- `GET /api/dicas/{tema}/{subtema}` - Lista dicas por tema e subtema
- `GET /api/{tema}/dicas/especialistas` - Lista dicas de especialistas por tema

### Ingredientes
- `GET /api/ingredientes` - Lista todas os ingredientes
- `POST /api/ingredientes` - Cria um novo ingrediente
- `PUT /api/ingredientes/{ingredienteId}` - Atualiza um ingrediente pelo ID
- `GET /api/ingredientes/{ingredienteId}` - Obtém um ingrediente pelo ID
- `DELETE /api/ingredientes/{ingredienteId}` - Remove um ingrediente pelo ID

### Quiz
- `GET /api/quizes` - Lista todos os quizzes
- `POST /api/quizes` - Cria um novo quiz
- `GET /api/quizes/:{quizId}` - Obtém um quiz pelo ID
- `PUT /api/quizes/:{quizId}` - Atualiza um quiz pelo ID
- `DELETE /api/quizes/:{quizId}` - Remove quiz pelo ID
- `POST /api/quizes/:{quizId}/validar` - Valida a resposta de um quiz

### Receitas
- `POST /api/receitas` - Cria uma nova receita
- `GET /api/receitas` - Lista todas as receitas
- `GET /api/receitas/{id}` - Obtém uma receita pelo ID
- `PUT /api/receitas/{id}` - Atualiza uma receita pelo ID
- `DELETE /api/receitas/{id}` - Deleta uma receita pelo ID
- `PATCH /api/receitas/{id}/verificar` - Verifica uma receita
- `GET /api/{tema}/receitas` - Lista receitas por tema
- `GET /api/{tema}/receitas/verificadas` - Lista receitas verificadas por tema
- `GET /api/{tema}/receitas/nao-verificadas`- Lista receitas não verificadas por tema
- `GET /api/receitas/{tema}/{subtema}` - Lista receitas por tema e subtema

### Tema 
- `GET /api/tema` - Lista todos os temas
- `GET /api/tema/{id}` - Verifica se um tema existe por ID
- `DELETE /api/tema/{id}` - Remove um tema pelo ID
- `GET /api/tema/{tema}/subtemas` - Lista subtemas de um tema

### Usuários
- `GET /api/usuario/me` - Obtém informações do usuário autenticado
- `POST /api/usuario` - Cria um novo usuário
- `GET /api/usuario` - Lista todos usuários
- `GET /api/usuario/{id}` - Obtém um usuário pelo ID
- `PUT /api/usuario/{id}` - Atualiza um usuário
- `DELETE /api/usuario/{id}` - Deleta um usuário pelo ID

### Autenticação
Esta API utiliza autenticação via JWT (JSON Web Token) para proteger rotas. O fluxo básico é:

1. Registro de Usuário:
-Endpoint: POST /auth/register
-Descrição: Cadastra um novo usuário.
-Exemplo de corpo da requisição:
```json
{
 "email": "teste1@gmail.com",
 "tokens": "153587",
 "senha": "senha123",
 "nome": "Sinval",
 "telefone": "123456787",
 "nivelConsciencia": "1",
 "isMonitor": false,
 "fotoUsu": "https://github.com/Sinvalluz.png"
}
```

2. Login de Usuário:
-Endpoint: POST /auth/login
-Descrição: Autentica o usuário e retorna um token JWT.
-Exemplo de corpo da requisição:
```json
{
  "email": "teste1@gmail.com",
  "senha": "senha123"
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
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:3000/api-docs
```

## 4. Endpoints Protegidos (Requer Token JWT)

### 4.1 Dicas

- **POST** `/api/dicas`  
  Cria uma nova dica.

- **PUT** `/api/dicas/{id}`  
  Atualiza uma dica.

- **DELETE** `/api/dicas/{id}`  
  Deleta uma dica pelo ID.

- **PATCH** `/api/dicas/{id}/verificar`  
  Verifica uma dica.

---

### 4.2 Tema

- **GET** `/api/tema`  
  Lista todos os temas.

- **GET** `/api/tema/{id}`  
  Verifica se um tema existe por ID.

- **DELETE** `/api/tema/{id}`  
  Remove um tema pelo ID.

- **GET** `/api/tema/{tema}/subtemas`  
  Lista subtemas de um tema.

---

### 4.3 Usuários

- **GET** `/api/usuario/me`  
  Obtém informações do usuário autenticado.

- **GET** `/api/usuario`  
  Lista todos os usuários.

- **GET** `/api/usuario/{id}`  
  Retorna dados de um usuário específico.

- **PUT** `/api/usuario/{id}`  
  Atualiza os dados de um usuário.

- **DELETE** `/api/usuario/{id}`  
  Remove um usuário.


## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
