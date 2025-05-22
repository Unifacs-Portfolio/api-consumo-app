-- CreateTable
CREATE TABLE "correlacaodicas" (
    "id" BIGINT NOT NULL,
    "iddicas" BIGINT,
    "subtema" TEXT,
    "assunto" TEXT,

    CONSTRAINT "correlacaodicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correlacaoreceitas" (
    "id" BIGINT NOT NULL,
    "idreceitas" BIGINT,
    "subtema" TEXT,
    "assunto" TEXT,

    CONSTRAINT "correlacaoreceitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dicas" (
    "id" BIGINT NOT NULL,
    "usuarioid" TEXT,
    "conteudo" TEXT,
    "isverify" BOOLEAN,
    "verifyby" TEXT,
    "datacriacao" TIMESTAMPTZ(6),
    "ultimaalteracao" TIMESTAMPTZ(6),

    CONSTRAINT "dicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotosreceitas" (
    "idfoto" BIGINT NOT NULL,
    "id" BIGINT,
    "url" TEXT,
    "createdat" TIMESTAMPTZ(6),

    CONSTRAINT "fotosreceitas_pkey" PRIMARY KEY ("idfoto")
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "idingrediente" BIGINT NOT NULL,
    "quantidade" TEXT,
    "medida" TEXT,
    "ingrediente" TEXT,
    "postagemid" BIGINT,

    CONSTRAINT "ingredientes_pkey" PRIMARY KEY ("idingrediente")
);

-- CreateTable
CREATE TABLE "perguntaquiz" (
    "id" BIGINT NOT NULL,
    "pergunta" TEXT,
    "respostaverdadeira" TEXT,

    CONSTRAINT "perguntaquiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receitas" (
    "id" BIGINT NOT NULL,
    "titulo" TEXT,
    "conteudo" TEXT,
    "isverify" BOOLEAN,
    "idusuario" TEXT,
    "verifyby" TEXT,
    "datacriacao" TIMESTAMPTZ(6),
    "ultimaalteracao" TIMESTAMPTZ(6),

    CONSTRAINT "receitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostasquiz" (
    "id" BIGINT NOT NULL,
    "idpergunta" BIGINT,
    "resposta" TEXT,

    CONSTRAINT "respostasquiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtema" (
    "id" BIGINT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "subtema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tema" (
    "id" BIGINT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "tema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temasubtema" (
    "id" BIGINT NOT NULL,
    "tema" TEXT,
    "subtema" TEXT,

    CONSTRAINT "temasubtema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "nome" TEXT,
    "telefone" TEXT,
    "nivelconsciencia" BIGINT,
    "ismonitor" BOOLEAN,
    "tokens" TEXT,
    "fotousu" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "subtema_descricao_key" ON "subtema"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "tema_descricao_key" ON "tema"("descricao");

-- AddForeignKey
ALTER TABLE "correlacaodicas" ADD CONSTRAINT "correlacaodicas_iddicas_fkey" FOREIGN KEY ("iddicas") REFERENCES "dicas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correlacaodicas" ADD CONSTRAINT "correlacaodicas_subtema_fkey" FOREIGN KEY ("subtema") REFERENCES "subtema"("descricao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correlacaoreceitas" ADD CONSTRAINT "correlacaoreceitas_idreceitas_fkey" FOREIGN KEY ("idreceitas") REFERENCES "receitas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correlacaoreceitas" ADD CONSTRAINT "correlacaoreceitas_subtema_fkey" FOREIGN KEY ("subtema") REFERENCES "subtema"("descricao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dicas" ADD CONSTRAINT "dicas_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fotosreceitas" ADD CONSTRAINT "fotosreceitas_id_fkey" FOREIGN KEY ("id") REFERENCES "receitas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredientes" ADD CONSTRAINT "ingredientes_postagemid_fkey" FOREIGN KEY ("postagemid") REFERENCES "receitas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_idusuario_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respostasquiz" ADD CONSTRAINT "respostasquiz_idpergunta_fkey" FOREIGN KEY ("idpergunta") REFERENCES "perguntaquiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "temasubtema" ADD CONSTRAINT "temasubtema_subtema_fkey" FOREIGN KEY ("subtema") REFERENCES "subtema"("descricao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "temasubtema" ADD CONSTRAINT "temasubtema_tema_fkey" FOREIGN KEY ("tema") REFERENCES "tema"("descricao") ON DELETE NO ACTION ON UPDATE NO ACTION;

