import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Dhaka Tech Conference 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A technology conference for developers and IT professionals.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://example.com/event-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'BICC, Dhaka' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  capacity: number;
}
