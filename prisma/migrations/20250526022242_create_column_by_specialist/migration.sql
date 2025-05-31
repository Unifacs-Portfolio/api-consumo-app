/*
  Warnings:

  - Added the required column `is_created_by_specialist` to the `dicas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dicas" ADD COLUMN     "is_created_by_specialist" BOOLEAN NOT NULL;
