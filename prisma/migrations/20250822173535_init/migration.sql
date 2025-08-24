-- CreateEnum
CREATE TYPE "public"."StatusType" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TicketType" AS ENUM ('VIP', 'REGULAR', 'EARLY_BIRD');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "couponId" INTEGER,
    "voucherId" INTEGER,
    "status" "public"."StatusType" NOT NULL,
    "pointsUsed" INTEGER NOT NULL DEFAULT 0,
    "discountVoucher" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountCoupon" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transactionDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionExpired" TIMESTAMP(3) NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionTicket" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "subtotalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TransactionTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "ticketType" "public"."TicketType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quota" INTEGER NOT NULL,
    "availableQty" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendee" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "isAttended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Voucher" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "voucherCode" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "voucherStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voucherEndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Point" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pointBalance" INTEGER NOT NULL DEFAULT 0,
    "pointExpired" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherCode_key" ON "public"."Voucher"("voucherCode");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "public"."Coupon"("couponCode");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "public"."Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionTicket" ADD CONSTRAINT "TransactionTicket_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionTicket" ADD CONSTRAINT "TransactionTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendee" ADD CONSTRAINT "Attendee_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Point" ADD CONSTRAINT "Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
