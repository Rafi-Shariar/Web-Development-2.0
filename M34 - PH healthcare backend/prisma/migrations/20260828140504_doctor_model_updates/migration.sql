/*
  Warnings:

  - You are about to drop the column `reviewAt` on the `doctors` table. All the data in the column will be lost.
  - The `additionalFiles` column on the `doctors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "reviewAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "resumePublicId" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
DROP COLUMN "additionalFiles",
ADD COLUMN     "additionalFiles" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");
