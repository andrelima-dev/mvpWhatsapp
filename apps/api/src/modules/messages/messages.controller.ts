import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Role } from '@mvp/types';

@Controller('conversations/:conversationId/messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')
  list(@Param('conversationId') conversationId: string) {
    return this.messagesService.listByConversation(conversationId);
  }
}
