import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Role } from '@mvp/types';
import { User } from '../../common/decorators/user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')
  findAll(@User() user: { sub: string }) {
    return this.conversationsService.findAllForUser(user.sub);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }
}
