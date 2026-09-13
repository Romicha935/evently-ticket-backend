import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Romicha',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Parvin',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'romicha@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}