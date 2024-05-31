import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users/users.entity';
import { UsersService } from 'src/users/users/users.service';
import { CreateUserDto } from './create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const { password: _, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user_data: user,
    };
  }

  async register(user: User) {
    if (!user.username || !user.password) {
      throw new BadRequestException('Username and password are required');
    }
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const newUser = { ...user };
    return this.usersService.create(newUser);
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
