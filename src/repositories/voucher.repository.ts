import { prisma } from "../config/prisma";

export class VoucherRepository {
  public static async createVoucherRepo(event_id: number, data: any) {
    return prisma.voucher.create({
      data: {
        voucher_code: data.voucher_code,
        discount_value: data.discount_value,
        voucher_start_date: new Date(data.voucher_start_date),
        voucher_end_date: new Date(data.voucher_end_date),
        event: {
          connect: { id: event_id }, // to make the voucher links automatically to the event
        },
      },
    });
  }
  public static async findVoucherByCodeRepo(eventId: number, code: string) {
    return prisma.voucher.findFirst({
      where: { event_id: eventId, voucher_code: code },
    });
  }

  public static async getVouchersByEventId(eventId: number) {
    return prisma.voucher.findMany({
      where: { event_id: eventId },
    });
  }
}
