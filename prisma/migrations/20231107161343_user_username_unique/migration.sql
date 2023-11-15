/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `GoogleProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GoogleProvider_providerId_key" ON "GoogleProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
