import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const { bookingId } = createPaymentDto;

    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      include: {
        event: true,
        seats: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending bookings can be paid',
      );
    }

    if (booking.payment) {
      throw new BadRequestException(
        'Payment already exists for this booking',
      );
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        currency: 'BDT',
        status: 'PENDING',
      },
    });

    return {
      message: 'Payment created successfully',
      payment,
    };
  }

  async findAll(userId: number) {
    return this.prisma.payment.findMany({
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
    const payment = await this.prisma.payment.findFirst({
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

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}