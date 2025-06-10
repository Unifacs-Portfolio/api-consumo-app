-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nivel_consciencia" TEXT NOT NULL,
    "is_monitor" BOOLEAN NOT NULL,
    "tokens" TEXT NOT NULL,
    "foto_usuario" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "temas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtemas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "subtemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temas_subtemas" (
    "tema_id" TEXT NOT NULL,
    "subtema_id" TEXT NOT NULL,

    CONSTRAINT "temas_subtemas_pkey" PRIMARY KEY ("tema_id","subtema_id")
);

-- CreateTable
CREATE TABLE "receitas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "is_verify" BOOLEAN NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "verify_by" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL,
    "data_alteracao" TIMESTAMP(3) NOT NULL,
    "image_source" TEXT NOT NULL,

    CONSTRAINT "receitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "id" TEXT NOT NULL,
    "quantidade" TEXT NOT NULL,
    "medida" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "receita_id" TEXT NOT NULL,

    CONSTRAINT "ingredientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dicas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "is_verify" BOOLEAN NOT NULL,
    "verify_by" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL,
    "data_alteracao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receitas_subtemas" (
    "receita_id" TEXT NOT NULL,
    "subtema_id" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,

    CONSTRAINT "receitas_subtemas_pkey" PRIMARY KEY ("receita_id","subtema_id")
);

-- CreateTable
CREATE TABLE "dicas_subtemas" (
    "dica_id" TEXT NOT NULL,
    "subtema_id" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,

    CONSTRAINT "dicas_subtemas_pkey" PRIMARY KEY ("dica_id","subtema_id")
);

-- CreateTable
CREATE TABLE "quizes" (
    "id" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "resposta_verdadeira" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "app" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "quizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "temas_titulo_key" ON "temas"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "subtemas_titulo_key" ON "subtemas"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "quizes_app_key" ON "quizes"("app");

-- AddForeignKey
ALTER TABLE "temas_subtemas" ADD CONSTRAINT "temas_subtemas_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "temas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temas_subtemas" ADD CONSTRAINT "temas_subtemas_subtema_id_fkey" FOREIGN KEY ("subtema_id") REFERENCES "subtemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientes" ADD CONSTRAINT "ingredientes_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "receitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dicas" ADD CONSTRAINT "dicas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receitas_subtemas" ADD CONSTRAINT "receitas_subtemas_receita_id_fkey" FOREIGN KEY ("receita_id") REFERENCES "receitas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receitas_subtemas" ADD CONSTRAINT "receitas_subtemas_subtema_id_fkey" FOREIGN KEY ("subtema_id") REFERENCES "subtemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dicas_subtemas" ADD CONSTRAINT "dicas_subtemas_dica_id_fkey" FOREIGN KEY ("dica_id") REFERENCES "dicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dicas_subtemas" ADD CONSTRAINT "dicas_subtemas_subtema_id_fkey" FOREIGN KEY ("subtema_id") REFERENCES "subtemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
