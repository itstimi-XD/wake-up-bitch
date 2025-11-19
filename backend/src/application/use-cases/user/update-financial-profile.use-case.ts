import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories';
import { User } from '@domain/entities';
import { NotFoundException } from '@shared/exceptions/base.exception';

export interface UpdateFinancialProfileDto {
  userId: string;
  income?: {
    salary?: number;
    sideHustle?: number;
    other?: number;
  };
  fixedExpenses?: {
    rent?: number;
    utilities?: number;
    insurance?: number;
    loan?: number;
    subscriptions?: number;
    transportation?: number;
    other?: number;
  };
  creditCard?: {
    thisMonthSpent?: number;
    paymentDay?: number;
  };
}

@Injectable()
export class UpdateFinancialProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: UpdateFinancialProfileDto): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Initialize financial profile if it doesn't exist
    if (!user.financialProfile) {
      user.financialProfile = {
        income: { salary: 0, sideHustle: 0, other: 0, total: 0 },
        fixedExpenses: {
          rent: 0,
          utilities: 0,
          insurance: 0,
          loan: 0,
          subscriptions: 0,
          transportation: 0,
          other: 0,
          total: 0,
        },
        creditCard: { thisMonthSpent: 0, paymentDay: 1 },
        calculated: {
          dailyExpense: 0,
          hourlyExpense: 0,
          minuteExpense: 0,
          disposableIncome: 0,
        },
      };
    }

    // Update income
    if (dto.income) {
      user.financialProfile.income = {
        ...user.financialProfile.income,
        ...dto.income,
        total: 0, // Will be calculated
      };
    }

    // Update fixed expenses
    if (dto.fixedExpenses) {
      user.financialProfile.fixedExpenses = {
        ...user.financialProfile.fixedExpenses,
        ...dto.fixedExpenses,
        total: 0, // Will be calculated
      };
    }

    // Update credit card
    if (dto.creditCard) {
      user.financialProfile.creditCard = {
        ...user.financialProfile.creditCard,
        ...dto.creditCard,
      };
    }

    // Calculate metrics
    user.calculateFinancialMetrics();

    // Save user
    return this.userRepository.update(user.id, user);
  }
}
