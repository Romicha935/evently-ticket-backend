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

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guards';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create payment for my booking',
  })
  create(
    @Req() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(
      req.user.userId,
      createPaymentDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get my payments',
  })
  findAll(@Req() req: any) {
    return this.paymentsService.findAll(
      req.user.userId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get my payment by ID',
  })
  findOne(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentsService.findOne(
      id,
      req.user.userId,
    );
  }
@Post(':id/mark-paid')
@ApiOperation({
  summary: 'Mark payment as paid (development only)',
})
markAsPaid(
  @Req() req: any,
  @Param('id', ParseIntPipe) id: number,
) {
  return this.paymentsService.markAsPaid(
    id,
    req.user.userId,
  );
}
}