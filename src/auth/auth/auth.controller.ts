import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './create.user.dto';
import { multerOptions } from 'src/common/multer/multer.config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: any,
  ) {
    if (!createUserDto.username || !createUserDto.password) {
      throw new BadRequestException('Username and password are required');
    }
    if (!file) {
    } else {
      const imageUrl = `uploads/${file.filename}`;
      createUserDto.imageUrl = imageUrl;
    }

    return this.authService.register(createUserDto);
  }
}
