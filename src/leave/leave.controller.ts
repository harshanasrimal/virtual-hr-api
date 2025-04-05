import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { changeStatusDto } from './dto/change-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('request')
  create(@Body() createLeaveDto: CreateLeaveDto, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.leaveService.create(createLeaveDto, user.id);
  }

  @Get('balance')
  getLeaveBalance(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.leaveService.getBalance(user.id);
  }

  @Get('all')
  findAll(@Req() req: Request) {
    const user = req.user as { id: string; role: string };
    return this.leaveService.findAll(user);
  }


  @Roles('HR')
  @Get('pending/count')
  getPendingLeaveCount() {
    return this.leaveService.getPendingCount();
  }

  @Roles('HR')
  @Get('recent')
  getRecentLeaves(@Query('limit') limit = 3) {
    return this.leaveService.getRecentLeaves(Number(limit));
  }

  @Roles('HR')
  @Get('approved/monthly')
  getMonthlyApprovedLeaves(@Query('year') year: string) {
    return this.leaveService.getMonthlyApprovedLeaves(Number(year));
  }

  @Roles('HR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Roles('HR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(id, updateLeaveDto);
  }

  @Roles('HR')
  @Post('status/:id')
  approve(
    @Body() changeStatusDto: changeStatusDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string };
    return this.leaveService.changeStatus(id, changeStatusDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.leaveService.remove(id);
    throw new UnauthorizedException(
      'You are not authorized to delete this leave request',
    );
  }
}
