import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from 'src/core/services';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService,PrismaService],
})
export class DocumentModule {}
