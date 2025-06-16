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
api-app/
│
├── /src
│   ├── /config            # Configurações da aplicação (como o banco de dados)
│   ├── /controllers       # Lógica de controle das requisições
│   ├── /models            # Definição dos modelos de dados (ORM)
│   ├── /routes            # Definição das rotas da API
│   ├── /middlewares       # Middlewares para validações e autenticação
│   ├── /utils             # Funções utilitárias e helpers
│   ├── /tests             # Testes unitários e de integração
│   └── app.js             # Arquivo principal da aplicação
├── /docs                  # Documentação da API (Swagger)
├── .env                   # Variáveis de ambiente (senhas, chaves, etc.)
├── .gitignore             # Arquivos e pastas ignorados pelo Git
├── package.json           # Dependências e scripts npm
└── README.md              # Documentação do projeto
```

## Pré-requisitos

Antes de iniciar, certifique-se de ter o seguinte instalado:

- Node.js (v14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/AAndreLuis-dev/api-app
cd api-app
```

2. Instale as dependências:
```bash
npm install
```

## Executando a Aplicação
```bash
npm run dev
```
## Rotas da API

### Autenticação

- POST /auth/register: Cadastro de novos usuários.
- POST /auth/login: Autenticação de usuários e obtenção de token JWT.

### Usuários
- GET /users : Lista todos os usuários.
- GET /users/ : Retorna detalhes de um usuário específico.
- PUT /users/ : Atualiza informações de um usuário.
- DELETE /users/:  Remove um usuário.

### Postagens
- GET /posts: Lista todas as postagens.
- POST /posts: Cria uma nova postagem.
- PUT /posts/: Atualiza uma postagem.
- DELETE /posts/ : Remove uma postagem.


### Dicas, Ingredientes e Temas 

Rotas similares para dicas, ingredientes e temas, conforme a estrutura do projeto.

## Teste
```bash
npm test
```

## Documentação da API

A documentação da API é gerada automaticamente utilizando o Swagger. Após iniciar o servidor, acesse a documentação via:

http://localhost:3000/api-docs


## Contribuição

1. Faça um fork do projeto.

2. Crie uma branch para a sua feature (git checkout -b feature/nova-feature).

3. Faça o commit das suas alterações (git commit -m 'Adiciona nova feature').

4. Envie para a branch principal (git push origin feature/nova-feature).

5. Abra um Pull Request.

## ✅ Status

🚧 Projeto em desenvolvimento 🚧
