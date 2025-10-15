import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateClientDto) {
    const createData = {
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      tags: payload.tags && payload.tags.length ? JSON.stringify(payload.tags) : '',
    };

    const updateData = {
      name: payload.name,
      tags: payload.tags && payload.tags.length ? JSON.stringify(payload.tags) : '',
    };

    return this.prisma.client.upsert({
      where: { phoneNumber: payload.phoneNumber },
      update: updateData,
      create: createData,
    });
  }

  findAll() {
    return this.prisma.client
      .findMany({ orderBy: { createdAt: 'desc' } })
      .then((rows) =>
        rows.map((r) => ({ ...r, tags: r.tags ? JSON.parse(r.tags as string) : [] })),
      );
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return { ...client, tags: client.tags ? JSON.parse(client.tags as string) : [] };
  }

  update(id: string, dto: UpdateClientDto) {
    const data: any = { ...dto };
    if (dto.tags) {
      data.tags = Array.isArray(dto.tags) ? JSON.stringify(dto.tags) : dto.tags;
    }
    return this.prisma.client.update({ where: { id }, data });
  }
}
