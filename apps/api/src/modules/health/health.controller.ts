import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  get() {
    return { ok: true, timestamp: new Date().toISOString() };
  }
}
