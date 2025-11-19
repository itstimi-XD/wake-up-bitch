import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsNumber, IsOptional, Min, Max } from 'class-validator';

class IncomeDto {
  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sideHustle?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  other?: number;
}

class FixedExpensesDto {
  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rent?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  utilities?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  insurance?: number;

  @ApiPropertyOptional({ example: 400 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loan?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subscriptions?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transportation?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  other?: number;
}

class CreditCardDto {
  @ApiPropertyOptional({ example: 800 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  thisMonthSpent?: number;

  @ApiPropertyOptional({ example: 15, description: 'Day of month (1-31)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDay?: number;
}

export class UpdateFinancialProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  income?: IncomeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  fixedExpenses?: FixedExpensesDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  creditCard?: CreditCardDto;
}
