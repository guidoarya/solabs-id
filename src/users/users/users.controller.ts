import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Put,
  Body,
  BadRequestException,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-guard.guard';
import { User } from './users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.config';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editUser(@Param('id') id: number, @Body() user: User): Promise<void> {
    if (!user || Object.keys(user).length === 0) {
      throw new BadRequestException('No user data provided');
    }

    await this.usersService.editById(id, user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async addUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: any,
  ) {
    if (!createUserDto.username || !createUserDto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const imageUrl = `uploads/${file.filename}`;
    createUserDto.imageUrl = imageUrl;
    return this.usersService.createUser(createUserDto);
  }
}
