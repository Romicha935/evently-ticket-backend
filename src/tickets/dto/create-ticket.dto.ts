import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    example: 1,
    description: 'Confirmed booking ID',
  })
  @IsInt()
  @Min(1)
  bookingId: number;
}
