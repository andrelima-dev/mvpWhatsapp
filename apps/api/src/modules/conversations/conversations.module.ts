import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationsController } from './conversations.controller';
import { ConversationsGateway } from './conversations.gateway';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { MessagesModule } from '../messages/messages.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [PrismaModule, MessagesModule, AssignmentsModule, JwtModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsGateway],
  exports: [ConversationsService, ConversationsGateway],
})
export class ConversationsModule {}
