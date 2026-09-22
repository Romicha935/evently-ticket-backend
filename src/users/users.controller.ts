import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users (Admin only)',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID (Admin only)',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.findOne(id);
  }
}
 