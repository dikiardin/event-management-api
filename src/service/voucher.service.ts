import { prisma } from "../config/prisma";
import { VoucherRepository } from "../repositories/voucher.repository";

export class VoucherService {
  public static async createVoucherService(
    user: any,
    eventId: number,
    data: any
  ) {
    // check if event belongs to organizer
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw { status: 404, message: "Event not found" };
    if (event.event_organizer_id !== user.id)
      throw { status: 403, message: "You are not the organizer of this event" };

    // check duplicate code
    const existing = await VoucherRepository.findVoucherByCodeRepo(
      eventId,
      data.voucher_code
    );
    if (existing)
      throw {
        status: 400,
        message: "Voucher code already exists for this event",
      };

    // validate date
    if (new Date(data.voucher_end_date) <= new Date(data.voucher_start_date))
      throw {
        status: 400,
        message: "Voucher end date must be after start date",
      };

    try {
      return await VoucherRepository.createVoucherRepo(eventId, data);
    } catch (err: any) {
      // handle unique constraint error (P2002)
      if (err.code === "P2002") {
        throw {
          status: 400,
          message: "*voucher code already exists for this event",
        };
      }
      throw err; // let global handler handle other errors
    }
  }

  public static async getVouchersByEventId(eventId: number) {
    const vouchers = await VoucherRepository.getVouchersByEventId(eventId);
    return vouchers;
  }

  public static async deleteExpiredVouchersService() {
    const result = await prisma.voucher.deleteMany({
      where: {
        voucher_end_date: {
          lt: new Date(),
        },
      },
    });
    console.log(`[VoucherService] Deleted ${result.count} expired vouchers`);
  }
}
