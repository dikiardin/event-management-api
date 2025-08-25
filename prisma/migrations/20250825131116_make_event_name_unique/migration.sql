/*
  Warnings:

  - A unique constraint covering the columns `[event_name]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_event_name_key" ON "public"."Event"("event_name");
