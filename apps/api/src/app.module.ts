import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import validationSchema from './config/validation';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ConversationsModule,
    WhatsappModule,
    MessagesModule,
  AssignmentsModule,
  HealthModule,
  ],
})
export class AppModule {}