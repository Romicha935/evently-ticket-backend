import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_auth.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a notification',
  })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(
      createNotificationDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get my notifications',
  })
  findAll(@Req() req: any) {
    return this.notificationsService.findAll(
      req.user.userId,
    );
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
  })
  markAsRead(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(
      id,
      req.user.userId,
    );
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Mark all notifications as read',
  })
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(
      req.user.userId,
    );
  }
  @Get('admin/all')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiOperation({
  summary: 'Get all notifications (Admin only)',
})
adminFindAll() {
  return this.notificationsService.adminFindAll();
}

@Get('admin/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiOperation({
  summary: 'Get notification by ID (Admin only)',
})
adminFindOne(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.notificationsService.adminFindOne(id);
}
}