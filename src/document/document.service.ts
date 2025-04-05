import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/core/services';
import { changeStatusDto } from './dto/change-status.dto';

@Injectable()
export class DocumentService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocumentDto, userId: string) {
    return this.prisma.documentRequest.create({
      data: {
        ...dto,
        userId,
      },
    });
  }
  
  async findAll(user: { id: string; role: string }) {
    let documents;
  
    if (user.role !== 'HR') {
      // Non-HR: only their own documents
      documents = await this.prisma.documentRequest.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          requestedDate: 'desc',
        }
      });
    } else {
      // HR: see all
      documents = await this.prisma.documentRequest.findMany({
        orderBy: {
          requestedDate: 'desc',
        },
        include: {
          user: {
            select: {
              email: true,
              image: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    }
  
    return documents;
  }
  
  async getPendingCount() {
    const count = await this.prisma.documentRequest.count({
      where: { status: 'PENDING' },
    });
    return { count };
  }
  
  async getRecent(limit: number) {
    return this.prisma.documentRequest.findMany({
      take: limit,
      orderBy: { requestedDate: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            image: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
  
    async findOne(id: string) {
      const leave = await this.prisma.documentRequest.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              image: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      if (!leave) {
        throw new BadRequestException('Document request not found');
      }
      return leave;
    }

    async changeStatus(
      id: string,
      dto: changeStatusDto,
      hrId: string,
      softCopyUrl?: string,
    ) {
      const data: any = {
        status: dto.status,
      };

  // Only set these if the document is being delivered
  if (dto.status === 'DELIVERED') {
    data.deliveredBy = hrId;
    data.deliveredDate = new Date();
    data.softCopyUrl = softCopyUrl ? softCopyUrl : null;
  } else{
    data.deliveredBy = null;
    data.deliveredDate = null;
    data.softCopyUrl = null;
  }
    
      return this.prisma.documentRequest.update({
        where: { id },
        data,
      });
    }
}
