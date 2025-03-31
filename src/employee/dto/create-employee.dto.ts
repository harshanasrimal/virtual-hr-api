import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateEmployeeDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string ;

    role: 'EMPLOYEE';

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    nic: string;
    
    @IsNotEmpty()
    @IsDateString()
    joinedDate: string;

    @IsString()
    @IsNotEmpty()
    designation: string;

    @IsString()
    @IsNotEmpty()
    jobDescription: string;

    @IsOptional()
    @IsString()
    address?: string;
}
