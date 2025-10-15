import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generateTokens(payload: Record<string, unknown>) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.config.get<string>('app.jwtRefreshExpiresIn'),
    });

    const expiresInDays = this.parseExpiresInDays(this.config.get<string>('app.jwtRefreshExpiresIn'));
    const expiresAt = add(new Date(), { days: expiresInDays });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload['sub'] as string,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }

  async rotateRefreshToken(token: string, payload: Record<string, unknown>) {
    await this.revokeRefreshToken(token);
    return this.generateTokens(payload);
  }

  private parseExpiresInDays(expiresIn: string | undefined): number {
    if (!expiresIn) {
      return 7;
    }
    const match = expiresIn.match(/(\d+)([a-zA-Z]+)/);
    if (!match) {
      return 7;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd':
      case 'day':
      case 'days':
        return value;
      case 'w':
      case 'week':
      case 'weeks':
        return value * 7;
      default:
        return 7;
    }
  }
}
