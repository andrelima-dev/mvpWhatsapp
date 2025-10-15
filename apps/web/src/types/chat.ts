import { MessageStatus, MessageSenderType, SupportLevel } from '@mvp/types';

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId?: string;
  senderLabel: string;
  senderType: MessageSenderType;
  content: string;
  mediaUrl?: string;
  status: MessageStatus;
  sentAt: string;
}

export interface ConversationDto {
  id: string;
  clientName: string;
  clientPhone: string;
  lastMessage?: MessageDto;
  level: SupportLevel;
  assignedTo?: string;
  unreadCount: number;
  updatedAt: string;
}
