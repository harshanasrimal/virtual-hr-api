import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/core/services';
import { LeaveService } from 'src/leave/leave.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService,LeaveService]
})
export class ChatModule {}
