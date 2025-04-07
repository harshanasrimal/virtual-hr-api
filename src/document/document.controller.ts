import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Request } from 'express';
import { Roles } from 'src/core/decorators/roles.decorator';
import { changeStatusDto } from './dto/change-status.dto';

@Controller('document')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('request')
  create(@Body() dto: CreateDocumentDto, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.documentService.create(dto, user.id);
  }

  @Get('all')
  findAll(@Req() req: Request) {
    const user = req.user as { id: string; role: string };
    return this.documentService.findAll(user);
  }

  @Roles('HR')
  @Get('pending/count')
  getPendingCount() {
    return this.documentService.getPendingCount();
  }

  @Roles('HR')
  @Get('recent')
  getRecent(@Query('limit') limit = 3) {
    return this.documentService.getRecent(Number(limit));
  }

  @Roles('HR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Roles('HR')
  @Post('status/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (extname(file.originalname).toLowerCase() !== '.pdf') {
        return cb(new Error('Only PDF files are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  changeStatus(
    @Body() changeStatusDto: changeStatusDto,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string };
    const softCopyUrl = file ? `/uploads/documents/${file.filename}` : undefined;
    return this.documentService.changeStatus(id, changeStatusDto, user.id, softCopyUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new UnauthorizedException('You are not authorized to delete this document request');
  }
}