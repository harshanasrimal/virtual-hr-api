import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from '@prisma/client';

export class changeStatusDto {
  @IsEnum(DocumentStatus)
  status: DocumentStatus;
}
