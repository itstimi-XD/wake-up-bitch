import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories';
import { User } from '@domain/entities';
import { ConflictException } from '@shared/exceptions/base.exception';
import * as bcrypt from 'bcrypt';

export interface RegisterUserDto {
  email: string;
  password: string;
  username: string;
  timezone?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException('User with this username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      username: dto.username,
      timezone: dto.timezone || 'UTC',
    });

    return user;
  }
}
