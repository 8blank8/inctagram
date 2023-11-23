/*
  Warnings:

  - A unique constraint covering the columns `[ip,title,userId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "city" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Device_ip_title_userId_key" ON "Device"("ip", "title", "userId");
