import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [EventsController],
  providers: [EventsService, RolesGuard],
})
export class EventsModule {}
