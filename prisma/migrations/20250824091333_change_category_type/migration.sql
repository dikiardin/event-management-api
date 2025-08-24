/*
  Warnings:

  - The values [MUSIC,SPORTS,CONFERENCE,WORKSHOP] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CategoryType_new" AS ENUM ('CONCERT', 'FESTIVAL', 'SPORT', 'THEATER');
ALTER TABLE "public"."Event" ALTER COLUMN "event_category" TYPE "public"."CategoryType_new" USING ("event_category"::text::"public"."CategoryType_new");
ALTER TYPE "public"."CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "public"."CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "public"."CategoryType_old";
COMMIT;
