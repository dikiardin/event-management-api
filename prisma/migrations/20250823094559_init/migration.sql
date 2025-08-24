/*
  Warnings:

  - You are about to drop the column `isAttended` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `couponCode` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `pointBalance` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `pointExpired` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `availableQty` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalPrice` on the `TransactionTicket` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `TransactionTicket` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `TransactionTicket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherCode` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherEndDate` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `voucherStartDate` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[coupon_code]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referral_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[voucher_code]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coupon_code` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_value` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_end_date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_organizer_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_start_date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `point_expired` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available_qty` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_type` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal_price` to the `TransactionTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_id` to the `TransactionTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `TransactionTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_value` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucher_code` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucher_end_date` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('ADMIN', 'ORGANIZER', 'USER');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('MUSIC', 'SPORTS', 'CONFERENCE', 'WORKSHOP');

-- DropForeignKey
ALTER TABLE "public"."Attendee" DROP CONSTRAINT "Attendee_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Coupon" DROP CONSTRAINT "Coupon_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Point" DROP CONSTRAINT "Point_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_voucherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionTicket" DROP CONSTRAINT "TransactionTicket_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionTicket" DROP CONSTRAINT "TransactionTicket_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voucher" DROP CONSTRAINT "Voucher_eventId_fkey";

-- DropIndex
DROP INDEX "public"."Coupon_couponCode_key";

-- DropIndex
DROP INDEX "public"."Voucher_voucherCode_key";

-- AlterTable
ALTER TABLE "public"."Attendee" DROP COLUMN "isAttended",
DROP COLUMN "transactionId",
ADD COLUMN     "is_attended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Coupon" DROP COLUMN "couponCode",
DROP COLUMN "createdAt",
DROP COLUMN "discountValue",
DROP COLUMN "userId",
ADD COLUMN     "coupon_code" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "name",
DROP COLUMN "startDate",
ADD COLUMN     "available_seats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_category" "public"."CategoryType" NOT NULL,
ADD COLUMN     "event_description" TEXT,
ADD COLUMN     "event_end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_location" TEXT NOT NULL,
ADD COLUMN     "event_name" TEXT NOT NULL,
ADD COLUMN     "event_organizer_id" INTEGER NOT NULL,
ADD COLUMN     "event_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "event_start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_thumbnail" TEXT,
ADD COLUMN     "total_seats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Point" DROP COLUMN "pointBalance",
DROP COLUMN "pointExpired",
DROP COLUMN "userId",
ADD COLUMN     "point_balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "point_expired" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "availableQty",
DROP COLUMN "eventId",
DROP COLUMN "ticketType",
ADD COLUMN     "available_qty" INTEGER NOT NULL,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "ticket_type" "public"."TicketType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."TransactionTicket" DROP COLUMN "subtotalPrice",
DROP COLUMN "ticketId",
DROP COLUMN "transactionId",
ADD COLUMN     "subtotal_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ticket_id" INTEGER NOT NULL,
ADD COLUMN     "transaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "point_last_earned_at" TIMESTAMP(3),
ADD COLUMN     "profile_pic" TEXT,
ADD COLUMN     "referral_code" TEXT,
ADD COLUMN     "role" "public"."RoleType" NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voucher" DROP COLUMN "discountValue",
DROP COLUMN "eventId",
DROP COLUMN "voucherCode",
DROP COLUMN "voucherEndDate",
DROP COLUMN "voucherStartDate",
ADD COLUMN     "discount_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "voucher_code" TEXT NOT NULL,
ADD COLUMN     "voucher_end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voucher_start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Transaction";

-- CreateTable
CREATE TABLE "public"."EventOrganizer" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "event_organizer_name" TEXT NOT NULL,
    "event_organizer_description" TEXT,
    "event_organizer_bank_account" TEXT,

    CONSTRAINT "EventOrganizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "coupon_id" INTEGER,
    "voucher_id" INTEGER,
    "status" "public"."StatusType" NOT NULL,
    "points_used" INTEGER NOT NULL DEFAULT 0,
    "discount_voucher" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_coupon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transaction_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_expired" TIMESTAMP(3) NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "review_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganizer_user_id_key" ON "public"."EventOrganizer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_coupon_code_key" ON "public"."Coupon"("coupon_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_referral_code_key" ON "public"."User"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucher_code_key" ON "public"."Voucher"("voucher_code");

-- AddForeignKey
ALTER TABLE "public"."EventOrganizer" ADD CONSTRAINT "EventOrganizer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_event_organizer_id_fkey" FOREIGN KEY ("event_organizer_id") REFERENCES "public"."EventOrganizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionTicket" ADD CONSTRAINT "TransactionTicket_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionTicket" ADD CONSTRAINT "TransactionTicket_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendee" ADD CONSTRAINT "Attendee_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Point" ADD CONSTRAINT "Point_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
