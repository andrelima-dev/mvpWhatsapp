import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MessageSenderType, MessageStatus } from '@mvp/types';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    });
  }

  async createAgentMessage(user: { id: string; name: string; role: string }, payload: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        conversationId: payload.conversationId,
        senderType: MessageSenderType.AGENT,
        agentId: user.id,
        content: payload.content,
        status: MessageStatus.SENT,
        senderLabel: `${user.name} — Time da Empresa XXX`,
      },
    });
  }

  async createClientMessage(payload: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        conversationId: payload.conversationId,
        senderType: MessageSenderType.CLIENT,
        content: payload.content,
        status: MessageStatus.DELIVERED,
        senderLabel: payload.senderLabel ?? 'Cliente',
      },
    });
  }
}
