import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { EmployeeModule } from './employee/employee.module';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    AuthModule,
    ChatModule,
    EmployeeModule,
    LeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
