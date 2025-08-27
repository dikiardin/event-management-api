-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "public"."Point"("id") ON DELETE SET NULL ON UPDATE CASCADE;
