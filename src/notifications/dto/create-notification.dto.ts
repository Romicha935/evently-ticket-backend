import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Booking Confirmed',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Your booking has been confirmed successfully.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'BOOKING_CONFIRMED',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}