import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { Role } from '@mvp/types';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPPORT_N1')
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN', 'SUPPORT_N2', 'SPECIALIST_N3')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }
}
