import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 'Booking Confirmed' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Your booking has been confirmed successfully.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'BOOKING_CONFIRMED' })
  @IsString()
  @IsNotEmpty()
  type: string;
}