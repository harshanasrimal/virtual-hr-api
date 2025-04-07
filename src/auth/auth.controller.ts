import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() dto:ChangePasswordDto, @Req() req: Request) {
    const user = req.user as { id: string };
    if (dto.newPassword !== dto.confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }
    return this.authService.changePassword(user.id, dto.oldPassword, dto.newPassword);
  }
}