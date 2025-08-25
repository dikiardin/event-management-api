/*
  Warnings:

  - The values [ADMIN] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - The values [EARLY_BIRD] on the enum `TicketType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `event_description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_thumbnail` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleType_new" AS ENUM ('ORGANIZER', 'USER');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."RoleType_new" USING ("role"::text::"public"."RoleType_new");
ALTER TYPE "public"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "public"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "public"."RoleType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TicketType_new" AS ENUM ('VIP', 'REGULAR');
ALTER TABLE "public"."Ticket" ALTER COLUMN "ticket_type" TYPE "public"."TicketType_new" USING ("ticket_type"::text::"public"."TicketType_new");
ALTER TYPE "public"."TicketType" RENAME TO "TicketType_old";
ALTER TYPE "public"."TicketType_new" RENAME TO "TicketType";
DROP TYPE "public"."TicketType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "event_description" SET NOT NULL,
ALTER COLUMN "event_thumbnail" SET NOT NULL;
