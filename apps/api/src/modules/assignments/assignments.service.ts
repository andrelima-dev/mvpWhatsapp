import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SupportLevel } from '@mvp/types';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async escalateConversation(conversationId: string, toLevel: SupportLevel, assignedBy: string) {
    const conversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { level: toLevel },
    });

    await this.prisma.assignmentLog.create({
      data: {
        conversationId,
        fromLevel: conversation.level,
        toLevel,
        assignedById: assignedBy,
      },
    });

    return conversation;
  }
}
