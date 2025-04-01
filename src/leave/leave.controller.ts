import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Roles('EMPLOYEE')
  @Post('request')
  create(@Body() createLeaveDto: CreateLeaveDto, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.leaveService.create(createLeaveDto, user.id);
  }

  @Roles('EMPLOYEE')
  @Get('balance')
  getLeaveBalance(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.leaveService.getBalance(user.id);
  }

  @Roles('HR')
  @Get("all")
  findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
