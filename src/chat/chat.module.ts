import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/core/services';
import { LeaveService } from 'src/leave/leave.service';
import { DocumentService } from 'src/document/document.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService,LeaveService,DocumentService]
})
export class ChatModule {}
