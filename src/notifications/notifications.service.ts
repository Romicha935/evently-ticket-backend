import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

 async create(
  userId: number,
  createNotificationDto: CreateNotificationDto,
) {
  const {
    title,
    message,
    type,
  } = createNotificationDto;

  return this.prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}

  async findAll(userId: number) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      message: 'All notifications marked as read',
    };
  }

  async adminFindAll() {
  return this.prisma.notification.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async adminFindOne(id: number) {
  const notification =
    await this.prisma.notification.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

  if (!notification) {
    throw new NotFoundException(
      'Notification not found',
    );
  }

  return notification;
}
}