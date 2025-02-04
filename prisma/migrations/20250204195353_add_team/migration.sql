/*
  Warnings:

  - A unique constraint covering the columns `[team]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "team" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_team_key" ON "users"("team");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("team") ON DELETE RESTRICT ON UPDATE CASCADE;
