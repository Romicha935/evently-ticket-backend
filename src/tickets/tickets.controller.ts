import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guards';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create ticket for a confirmed booking',
  })
  create(
    @Req() req: any,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketsService.create(
      req.user.userId,
      createTicketDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get my tickets',
  })
  findAll(@Req() req: any) {
    return this.ticketsService.findAll(
      req.user.userId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get my ticket by ID',
  })
  findOne(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketsService.findOne(
      id,
      req.user.userId,
    );
  }
}
