/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "userProfileId" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "avatarUrl",
ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "dateOfBirth" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
