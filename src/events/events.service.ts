import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        image: createEventDto.image,
        location: createEventDto.location,
        date: new Date(createEventDto.date),
        price: createEventDto.price,
        capacity: createEventDto.capacity,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.findOne(id);

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: updateEventDto.date
          ? new Date(updateEventDto.date)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}