import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class MakeAdminDto {
  @ApiProperty({
    example: 'romicha@example.com',
    description: 'Email of the user to promote to admin',
  })
  @IsEmail()
  email: string;
}