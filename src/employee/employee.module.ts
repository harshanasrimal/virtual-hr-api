import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from 'src/core/services';
import { EmailService } from 'src/core/services/email.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService,PrismaService,EmailService],
})
export class EmployeeModule {}
