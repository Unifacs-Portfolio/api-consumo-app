/*
  Warnings:

  - Added the required column `titulo` to the `dicas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dicas" ADD COLUMN     "titulo" TEXT NOT NULL;
