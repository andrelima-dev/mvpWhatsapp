import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({ namespace: '/ws/conversations', cors: { origin: '*' } })
export class ConversationsGateway implements OnGatewayConnection {
  @WebSocketServer() private readonly server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.userId = payload.sub;
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('conversation.join')
  async joinConversation(client: Socket, payload: { conversationId: string }) {
    const userId = client.data.userId;
    if (!userId || !payload.conversationId) return;
    client.join(payload.conversationId);
  }

  @SubscribeMessage('message.send')
  async sendMessage(client: Socket, payload: { conversationId: string; content: string }) {
    const userId = client.data.userId;
    if (!userId || !payload.conversationId) return;

    const message = await this.messagesService.createAgentMessage(
      { id: userId, name: client.data.name ?? 'Agente', role: client.data.role ?? 'SUPPORT_N1' },
      {
        conversationId: payload.conversationId,
        content: payload.content,
      },
    );
    this.server.to(payload.conversationId).emit('message.new', message);
  }
}
