/*
  Warnings:

  - Changed the type of `status` on the `Transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatusType" AS ENUM ('WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'SUCCESS', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Transactions" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PaymentStatusType" NOT NULL;

-- DropEnum
DROP TYPE "public"."StatusType";
