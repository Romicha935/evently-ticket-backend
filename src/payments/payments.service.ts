import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';

import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey);
  }

  async createCheckoutSession(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ) {
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
  user: true,
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

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.event.title,
              description: `Seats: ${booking.seats
                .map((seat) => seat.seatNumber)
                .join(', ')}`,
            },
            unit_amount: Math.round(booking.totalAmount * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking.id.toString(),
        userId: userId.toString(),
      },

      success_url:
        'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',

      cancel_url:
        'http://localhost:3000/payment/cancel',

      customer_email: booking.user?.email,
    });

    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        currency: 'usd',
        status: 'PENDING',
        stripeSessionId: session.id,
      },
    });

    return {
      message: 'Checkout session created',
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  }
}