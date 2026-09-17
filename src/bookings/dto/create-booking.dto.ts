import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  eventId: number;

  @ApiProperty({
    example: ['A1', 'A2', 'A3'],
    type: [String],
  })
  @IsNotEmpty()
  seatNumbers: string[];
}