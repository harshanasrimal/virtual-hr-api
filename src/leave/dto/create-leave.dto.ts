import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LeaveType } from '@prisma/client';

export class CreateLeaveDto {
  @IsEnum(LeaveType)
  type: LeaveType;

  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
