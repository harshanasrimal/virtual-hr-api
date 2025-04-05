import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('new')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('all')
  findAll() {
    return this.employeeService.findAll();
  }

  @Post('image/:id')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      const userId = req.params.id;
      cb(null, `${userId}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only JPG, JPEG, and PNG are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
}))
async updateProfilePicture(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  const imagePath = `https://hr-api.harshanasrimal.com/uploads/profile/${file.filename}`;
  return this.employeeService.updateProfilePicture(id, imagePath);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.employeeService.remove(id);
    return new UnauthorizedException('You are not authorized to perform this action');
  }
}
