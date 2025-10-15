import { Module } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
