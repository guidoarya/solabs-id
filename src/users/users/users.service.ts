import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async editById(id: number, user: User): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new BadRequestException('Akun tidak ditemukan');
    }

    Object.assign(existingUser, user);

    await this.usersRepository.save(existingUser);
  }

  async createUser(createUserDto: User): Promise<User> {
    const { username, password, imageUrl } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      imageUrl,
    });

    return this.usersRepository.save(user);
  }
}
