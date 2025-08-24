import { prisma } from "../config/prisma";

export default class EventRepository {
  async create(data: any) {
    return await prisma.event.create({ data });
  }

  async findAll() {
    return await prisma.event.findMany({
      include: {
        organizer: true,
        tickets: true,
        vouchers: true,
        reviews: true,
      },
    });
  }

  async findById(id: number) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        tickets: true,
        vouchers: true,
        reviews: true,
      },
    });
  }

  async update(id: number, data: any) {
    return await prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.event.delete({
      where: { id },
    });
  }
}
