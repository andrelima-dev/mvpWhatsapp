import { Body, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service.js';
import { ConversationsService } from '../conversations/conversations.service.js';
import { MessagesService } from '../messages/messages.service.js';



interface EvolutionWebhookPayload {
  event: string;
  data: Array<{
    remoteJid: string;
    messageId: string;
    message: { conversation?: string };
    timestamp: number;
  }>;
}

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly config: ConfigService,
    private readonly whatsappService: WhatsappService,
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('x-webhook-signature') signature: string,
    @Body() payload: EvolutionWebhookPayload,
  ) {
    const expectedSignature = this.config.get<string>('app.whatsappWebhookSecret');
    if (expectedSignature && signature !== expectedSignature) {
      return { success: false };
    }

    for (const item of payload.data) {
      const conversation = await this.conversationsService.ensureFromWebhook({
        remoteJid: item.remoteJid,
        messageId: item.messageId,
      });

      await this.messagesService.createClientMessage({
        conversationId: conversation.id,
        content: item.message.conversation ?? '',
        senderLabel: 'Cliente',
      });
    }

    return { success: true };
  }
}
