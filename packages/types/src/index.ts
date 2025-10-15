export enum Role {
  ADMIN = 'ADMIN',
  SUPPORT_N1 = 'SUPPORT_N1',
  SUPPORT_N2 = 'SUPPORT_N2',
  SPECIALIST_N3 = 'SPECIALIST_N3',
  VIEWER = 'VIEWER',
}

export enum SupportLevel {
  N1 = 'N1',
  N2 = 'N2',
  N3 = 'N3',
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

export enum MessageSenderType {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
