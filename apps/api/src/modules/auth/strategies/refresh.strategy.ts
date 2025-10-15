import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      passReqToCallback: true,
      secretOrKey: config.get<string>('app.jwtRefreshSecret'),
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente');
    }
    return { ...payload, refreshToken };
  }
}
