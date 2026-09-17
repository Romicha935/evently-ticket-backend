import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guards';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

@Post()
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Create a booking' })
create(
  @Req() req: any,
  @Body() createBookingDto: CreateBookingDto,
) {
  return this.bookingsService.create(
    req.user.userId,
    createBookingDto,
  );
}
  @Get()
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get my bookings' })
findAll(@Req() req: any) {
  return this.bookingsService.findAll(req.user.userId);
}
@Get(':id')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get my booking by ID' })
findOne(
  @Req() req: any,
  @Param('id', ParseIntPipe) id: number,
) {
  return this.bookingsService.findOne(
    id,
    req.user.userId,
  );
}
@Patch(':id/cancel')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Cancel my booking' })
cancel(
  @Req() req: any,
  @Param('id', ParseIntPipe) id: number,
) {
  return this.bookingsService.cancel(
    id,
    req.user.userId,
  );
}
}