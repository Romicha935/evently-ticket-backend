import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { eventId, seatNumbers } = createBookingDto;

    // 1. Check event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // 2. Check seat list
    if (!seatNumbers || seatNumbers.length === 0) {
      throw new BadRequestException('At least one seat is required');
    }

    // 3. Remove duplicate seats
    const uniqueSeats = [...new Set(seatNumbers)];

    if (uniqueSeats.length !== seatNumbers.length) {
      throw new BadRequestException('Duplicate seats are not allowed');
    }

    // 4. Check already booked seats
    const bookedSeats = await this.prisma.bookingSeat.findMany({
      where: {
        booking: {
          eventId,
        },
        seatNumber: {
          in: uniqueSeats,
        },
      },
      select: {
        seatNumber: true,
      },
    });

    if (bookedSeats.length > 0) {
      const seats = bookedSeats.map((seat) => seat.seatNumber);

      throw new BadRequestException(
        `These seats are already booked: ${seats.join(', ')}`,
      );
    }

    // 5. Calculate total
    const totalAmount = event.price * uniqueSeats.length;

    // 6. Create booking + seats
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        eventId,
        totalAmount,
        status: 'PENDING',
        seats: {
          create: uniqueSeats.map((seatNumber) => ({
            seatNumber,
          })),
        },
      },
      include: {
        event: true,
        seats: true,
      },
    });

    return {
      message: 'Booking created successfully',
      booking,
    };
  }
  async findAll(userId: number) {
  return this.prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
      seats: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async findOne(id: number, userId: number) {
  const booking = await this.prisma.booking.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      event: true,
      seats: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  return booking;
}

async cancel(id: number, userId: number) {
  const booking = await this.findOne(id, userId);

  if (booking.status === 'CANCELLED') {
    throw new BadRequestException('Booking is already cancelled');
  }

  if (booking.status === 'CONFIRMED') {
    throw new BadRequestException(
      'Confirmed booking cannot be cancelled',
    );
  }

  return this.prisma.booking.update({
    where: {
      id,
    },
    data: {
      status: 'CANCELLED',
    },
  });
}
}