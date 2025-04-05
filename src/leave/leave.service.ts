import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { PrismaService } from 'src/core/services';
import { changeStatusDto } from './dto/change-status.dto';

const initialLeaveBalance = {
  annual: 14,
  casual: 7,
  medical: 5,  
}

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}


  async create(dto: CreateLeaveDto, userId: string) {
    const { type, fromDate, toDate, reason } = dto;

    let balance = await this.prisma.leaveBalance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await this.prisma.leaveBalance.create({
        data: {
          userId,
          ...initialLeaveBalance
        },
      });
    }

    const from = DateTime.fromISO(dto.fromDate, { zone: 'Asia/Colombo' }).startOf('day');
    const to = DateTime.fromISO(dto.toDate, { zone: 'Asia/Colombo' }).endOf('day');

    // Calculate number of days
    const dayCount = Math.ceil((to.toMillis() - from.toMillis()) / (1000 * 3600 * 24));
    if (dayCount <= 0) throw new BadRequestException('Invalid leave period'); 

    // Check if enough leave is available
  const remaining = balance[type.toLowerCase()];
  if (remaining < dayCount) {
    throw new BadRequestException(`Not enough ${type.toLowerCase()} leave`);
  }

    // Create leave request (status is PENDING by default)
  const leave = await this.prisma.leaveRequest.create({
    data: {
      userId,
      type,
      fromDate: from.toJSDate(),
      toDate: to.toJSDate(),
      reason,
    },
  });

    return leave;
  }

  async getBalance(userId: string) {
    let balance = await this.prisma.leaveBalance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await this.prisma.leaveBalance.create({
        data: {
          userId,
          ...initialLeaveBalance
        },
      });
    }

    return balance;
  }

  async findAll(user: { id: string; role: string }) {
    let leaves;
  
    if (user.role !== 'HR') {
      // Non-HR: only their own leaves
      leaves = await this.prisma.leaveRequest.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    } else {
      // HR: see all
      leaves = await this.prisma.leaveRequest.findMany({
        orderBy: {
          createdAt: 'desc',
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
  
    return leaves;
  }
  

  async findOne(id: string) {
    const leave = await this.prisma.leaveRequest.findUnique({
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
      throw new BadRequestException('Leave request not found');
    }
    return leave;
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto) {
    const leave =  this.prisma.leaveRequest.update({
      where: { id },
      data: updateLeaveDto,
    });
    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }
    return leave;
  }

  async remove(id: string) {
    const leave = await this.prisma.leaveRequest.delete({
      where: { id },
    });
    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }
    return leave;
  }

  // Change status of leave request
  async changeStatus(id: string, dto:changeStatusDto, userId: string) {
    const leave = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!leave) {
      throw new BadRequestException('Leave request not found');
    }
    // update leave balance
    let balance = await this.prisma.leaveBalance.findUnique({
      where: { userId: leave.userId },
    });
    if (!balance) {
      balance = await this.prisma.leaveBalance.create({
        data: {
          userId: leave.userId,
          ...initialLeaveBalance
        },
      });
    }
    const type = leave.type.toLowerCase();
    if (dto.status === 'APPROVED' && leave.status !== 'APPROVED') {
      // deduct leave from balance
      const millisecondsDiff = leave.toDate.getTime() - leave.fromDate.getTime();
      const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));
      balance[type] -= daysDiff;
      // update leave balance
      await this.prisma.leaveBalance.update({
        where: { userId: leave.userId },
        data: {
          [type]: balance[type],
        },
      });
    } else if (leave.status === 'APPROVED' && dto.status !== 'APPROVED') {
      // add leave back to balance
      const millisecondsDiff = leave.toDate.getTime() - leave.fromDate.getTime();
      const daysDiff = Math.ceil(millisecondsDiff / (1000 * 60 * 60 * 24));
      balance[type] += daysDiff;
      await this.prisma.leaveBalance.update({
        where: { userId: leave.userId },
        data: {
          [type]: balance[type],
        },
      });
    }
    // update leave request status
    const res = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        approvedBy: dto.status === 'APPROVED' ? userId : null,
        ...dto
      },
    });
    return res;
  }

  async getPendingCount() {
    const count = await this.prisma.leaveRequest.count({
      where: { status: 'PENDING' },
    });
    return { count };
  }

  async getRecentLeaves(limit: number) {
    const leaves = await this.prisma.leaveRequest.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    return leaves;
  }
  
  async getMonthlyApprovedLeaves(year: number) {
    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        MONTH(fromDate) AS month,
        COUNT(*) AS count
      FROM leave_requests
      WHERE status = 'APPROVED' AND YEAR(fromDate) = ${year}
      GROUP BY month
      ORDER BY month
    `);
  
    // Fill empty months with 0
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
    }));
    
    for (const row of results) {
      monthly[row.month - 1].count = Number(row.count);
    }
  
    return {data: monthly};
  }
  
}
