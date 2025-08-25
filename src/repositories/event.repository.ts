import { prisma } from "../config/prisma";
import { CategoryType } from "../generated/prisma";

export const createEventRepo = async (data: any) => {
  return prisma.event.create({ data });
};

export const findAllEventsRepo = async (category?: string) => {
  return prisma.event.findMany({
    where: category
      ? { event_category: category.toUpperCase() as CategoryType }
      : {},
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });
};

export const findEventByIdRepo = async (id: number) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });
};

export const updateEventRepo = async (id: number, data: any) => {
  return prisma.event.update({
    where: { id },
    data,
  });
};

export const deleteEventRepo = async (id: number) => {
  return prisma.event.delete({
    where: { id },
  });
};
