import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendMessagePayload {
  to: string;
  message: string;
  senderName: string;
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly instanceId: string;

  constructor(private readonly http: HttpService, private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('app.whatsappProviderUrl') ?? '';
    this.apiKey = this.config.get<string>('app.whatsappApiKey') ?? '';
    this.instanceId = this.config.get<string>('app.whatsappInstanceId') ?? '';
  }

  async sendMessage(payload: SendMessagePayload) {
    if (!this.baseUrl) {
      this.logger.warn('WhatsApp provider not configured');
      return;
    }

    await this.http
      .post(
        `${this.baseUrl}/message/send`,
        {
          instanceId: this.instanceId,
          to: payload.to,
          message: payload.message,
          from: payload.senderName,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .toPromise();
  }
}
