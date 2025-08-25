/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voucher_event_id_key" ON "public"."Voucher"("event_id");
