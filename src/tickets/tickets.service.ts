import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createTicketDto: CreateTicketDto,
  ) {
    const { bookingId } = createTicketDto;

    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      include: {
        payment: true,
        ticket: true,
        event: true,
        seats: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Ticket can only be created for a confirmed booking',
      );
    }

    if (!booking.payment || booking.payment.status !== 'PAID') {
      throw new BadRequestException(
        'Payment must be completed before creating a ticket',
      );
    }

    if (booking.ticket) {
      throw new BadRequestException(
        'Ticket already exists for this booking',
      );
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        bookingId: booking.id,
        ticketCode: `EVT-${randomUUID()
          .replace(/-/g, '')
          .slice(0, 12)
          .toUpperCase()}`,
        status: 'ACTIVE',
      },
      include: {
        booking: {
          include: {
            event: true,
            seats: true,
          },
        },
      },
    });

    return {
      message: 'Ticket created successfully',
      ticket,
    };
  }

  async findAll(userId: number) {
    return this.prisma.ticket.findMany({
      where: {
        booking: {
          userId,
        },
      },
      include: {
        booking: {
          include: {
            event: true,
            seats: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id,
        booking: {
          userId,
        },
      },
      include: {
        booking: {
          include: {
            event: true,
            seats: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }
}
