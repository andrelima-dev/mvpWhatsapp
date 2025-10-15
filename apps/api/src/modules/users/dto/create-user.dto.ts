import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { Role } from '@mvp/types';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsIn(['ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3', 'VIEWER'])
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  team?: string;
}
