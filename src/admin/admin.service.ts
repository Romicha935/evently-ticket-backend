import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalEvents,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalPayments,
      paidPayments,
      totalTickets,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.event.count(),

      this.prisma.booking.count(),

      this.prisma.booking.count({
        where: {
          status: 'CONFIRMED',
        },
      }),

      this.prisma.booking.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.booking.count({
        where: {
          status: 'CANCELLED',
        },
      }),

      this.prisma.payment.count(),

      this.prisma.payment.findMany({
        where: {
          status: 'PAID',
        },
        select: {
          amount: true,
        },
      }),

      this.prisma.ticket.count(),
    ]);

    const totalRevenue = paidPayments.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    return {
      users: {
        total: totalUsers,
      },

      events: {
        total: totalEvents,
      },

      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
      },

      payments: {
        total: totalPayments,
        paid: paidPayments.length,
        revenue: totalRevenue,
        currency: 'BDT',
      },

      tickets: {
        total: totalTickets,
      },
    };
  }
}