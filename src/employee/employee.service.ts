import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/core/services';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EmployeeService {
  constructor(private prisma:PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: createEmployeeDto.email },
    });
  
    if (exists) throw new BadRequestException('User already exists');

      // Generate password
  const password = crypto.randomBytes(8).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user with the hashed password
  const created = await this.prisma.user.create({
    data: {
      email: createEmployeeDto.email,
      password: hashedPassword,
      role: 'EMPLOYEE',
      phone: createEmployeeDto.phone,
      isActive: true,
      profile: {
        create: {
          firstName: createEmployeeDto.firstName,
          lastName: createEmployeeDto.lastName,
          designation: createEmployeeDto.designation,
          jobDescription: createEmployeeDto.jobDescription,
          nic: createEmployeeDto.nic,
          address: createEmployeeDto.address,
          joinedDate: new Date(createEmployeeDto.joinedDate),
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Send email with password
  // await this.mailService.sendMail({
  //   to: createEmployeeDto.email,
  //   subject: 'Welcome to the system',
  //   text: `Your password is ${password}`,
  // });


  const { password: _, ...userWithoutPassword } = created;
  return userWithoutPassword;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
    if (!employee) throw new BadRequestException('User not found');
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const { email, phone, ...profileData } = dto;
  
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(phone && { phone }),
        profile: {
          update: {
            ...Object.fromEntries(
              Object.entries(profileData).filter(([_, v]) => v !== undefined)
            ),
            ...(dto.joinedDate && { joinedDate: new Date(dto.joinedDate) }),
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async updateProfilePicture(userId: string, imagePath: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { image: imagePath },
    });
  }
  

  remove(id: string) {
    return `This action removes a #${id} employee`;
  }
}
