import { IsArray, IsOptional, IsString, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsString()
  @Matches(/^\d{10,14}$/)
  phoneNumber!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[] = [];
}
