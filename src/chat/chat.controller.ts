import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { MessageDto } from './dto/message.dto';
  import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
  import { Request } from 'express';
  
  @UseGuards(JwtAuthGuard)
  @Controller('chat')
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Post('message')
    async sendMessage(@Body() dto: MessageDto, @Req() req: Request) {
      const user = req.user as { id: string };
      try {
        const response = await this.chatService.handleMessage(dto.message, user.id);
        return { success: true, message: response };
      } catch (error) {
        console.error('Chat Error:', error); // Log to console
        throw new InternalServerErrorException('Chat failed. Please try again.');
      }
    }
  }
  