import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UpdateFinancialProfileUseCase } from '@application/use-cases/user/update-financial-profile.use-case';
import { IUserRepository } from '@domain/repositories';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateFinancialProfileUseCase: UpdateFinancialProfileUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('me')
  async getMe(@Request() req) {
    const user = await this.userRepository.findById(req.user.sub);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      timezone: user.timezone,
      financialProfile: user.financialProfile,
    };
  }

  @Put('me/financial-profile')
  async updateFinancialProfile(@Request() req, @Body() dto: any) {
    return this.updateFinancialProfileUseCase.execute({
      userId: req.user.sub,
      ...dto,
    });
  }
}
