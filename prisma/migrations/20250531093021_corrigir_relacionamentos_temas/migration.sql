/*
  Warnings:

  - You are about to drop the column `titulo` on the `subtemas` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the `temas_subtemas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tema_id,nome]` on the table `subtemas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `temas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tema_id` to the `dicas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tema_id` to the `receitas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `subtemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tema_id` to the `subtemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `temas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "temas_subtemas" DROP CONSTRAINT "temas_subtemas_subtema_id_fkey";

-- DropForeignKey
ALTER TABLE "temas_subtemas" DROP CONSTRAINT "temas_subtemas_tema_id_fkey";

-- DropIndex
DROP INDEX "quizes_app_key";

-- DropIndex
DROP INDEX "subtemas_titulo_key";

-- DropIndex
DROP INDEX "temas_titulo_key";

-- AlterTable
ALTER TABLE "dicas" ADD COLUMN     "tema_id" TEXT NOT NULL,
ALTER COLUMN "verify_by" DROP NOT NULL,
ALTER COLUMN "data_criacao" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "receitas" ADD COLUMN     "tema_id" TEXT NOT NULL,
ALTER COLUMN "verify_by" DROP NOT NULL,
ALTER COLUMN "data_criacao" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "subtemas" DROP COLUMN "titulo",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "tema_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "temas" DROP COLUMN "titulo",
ADD COLUMN     "nome" TEXT NOT NULL;

-- DropTable
DROP TABLE "temas_subtemas";

-- CreateIndex
CREATE UNIQUE INDEX "subtemas_tema_id_nome_key" ON "subtemas"("tema_id", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "temas_nome_key" ON "temas"("nome");

-- AddForeignKey
ALTER TABLE "subtemas" ADD CONSTRAINT "subtemas_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "temas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "temas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receitas" ADD CONSTRAINT "receitas_verify_by_fkey" FOREIGN KEY ("verify_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dicas" ADD CONSTRAINT "dicas_tema_id_fkey" FOREIGN KEY ("tema_id") REFERENCES "temas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dicas" ADD CONSTRAINT "dicas_verify_by_fkey" FOREIGN KEY ("verify_by") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
