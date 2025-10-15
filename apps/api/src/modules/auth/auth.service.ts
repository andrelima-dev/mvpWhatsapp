import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import type { Role } from '@mvp/types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
  team?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly config: ConfigService,
  ) {}

  async register(payload: RegisterPayload) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const user = await this.usersService.create({
      ...payload,
      role: (payload.role ?? 'SUPPORT_N1') as Role,
    });
    return this.generateSession(user.id, user.email, user.name, user.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.generateSession(user.id, user.email, user.name, user.role);
  }

  async logout(refreshToken: string) {
    await this.tokensService.revokeRefreshToken(refreshToken);
    return { success: true };
  }

  async refresh(user: { sub: string; email: string; name: string; role: string }, refreshToken: string) {
    return this.tokensService.rotateRefreshToken(refreshToken, {
      sub: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  private async generateSession(id: string, email: string, name: string, role: string) {
    const payload = { sub: id, email, name, role };
    const tokens = await this.tokensService.generateTokens(payload);
    return {
      user: {
        id,
        email,
        name,
        role,
      },
      ...tokens,
      expiresIn: this.config.get<string>('app.jwtExpiresIn'),
    };
  }
}
