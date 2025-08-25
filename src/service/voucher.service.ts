import {
  createVoucherRepo,
  findVoucherByCodeRepo,
} from "../repositories/voucher.repository";
import { prisma } from "../config/prisma";

export const createVoucherService = async (
  user: any,
  eventId: number,
  data: any
) => {

  // check if event belongs to organizer
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw { status: 404, message: "Event not found" };
  if (event.event_organizer_id !== user.id)
    throw { status: 403, message: "You are not the organizer of this event" };

  // check duplicate code
  const existing = await findVoucherByCodeRepo(eventId, data.voucher_code);
  if (existing)
    throw {
      status: 400,
      message: "Voucher code already exists for this event",
    };

  // validate date
  if (new Date(data.voucher_end_date) <= new Date(data.voucher_start_date))
    throw { status: 400, message: "Voucher end date must be after start date" };

  return createVoucherRepo(eventId, data);
};

// when using voucher (for purchase)
export const validateVoucherService = async (eventId: number, code: string) => {
  // if foucher not found
  const voucher = await findVoucherByCodeRepo(eventId, code);
  if (!voucher) throw { status: 404, message: "Voucher not found" };

  // if voucher expired
  const now = new Date();
  if (now < voucher.voucher_start_date || now > voucher.voucher_end_date)
    throw { status: 400, message: "Voucher expired or not yet active" };

  return voucher;
};
