import { prisma } from "../config/prisma";

export const createVoucherRepo = async (event_id: number, data: any) => {
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
};

export const findVoucherByCodeRepo = async (eventId: number, code: string) => {
  return prisma.voucher.findFirst({
    where: { event_id: eventId, voucher_code: code },
  });
};
