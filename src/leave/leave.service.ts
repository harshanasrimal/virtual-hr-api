import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { PrismaService } from 'src/core/services';

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
          annual: 14,
          casual: 7,
          medical: 5,
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
          annual: 14,
          casual: 7,
          medical: 5,
        },
      });
    }

    return balance;
  }

  async findAll() {
    const leaves = await this.prisma.leaveRequest.findMany({
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
    }
    });

    return leaves;
  }

  findOne(id: number) {
    return `This action returns a #${id} leave`;
  }

  update(id: number, updateLeaveDto: UpdateLeaveDto) {
    return `This action updates a #${id} leave`;
  }

  remove(id: number) {
    return `This action removes a #${id} leave`;
  }
}
