import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm password must match new password' })
  confirmPassword: string;
}