import { Controller, Get, Put, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateFinancialProfileUseCase } from '@application/use-cases/user/update-financial-profile.use-case';
import { IUserRepository } from '@domain/repositories';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateFinancialProfileDto } from '../dtos/user.dto';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly updateFinancialProfileUseCase: UpdateFinancialProfileUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Request() req: AuthenticatedRequest) {
    const user = await this.userRepository.findById(req.user.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

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
  @ApiOperation({ summary: 'Update financial profile' })
  async updateFinancialProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateFinancialProfileDto,
  ) {
    return this.updateFinancialProfileUseCase.execute({
      userId: req.user.sub,
      ...dto,
    });
  }
}
