import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class UpdateAlarmDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @IsString()
  soundId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  volume?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  vibrationPattern?: number[];

  @IsOptional()
  @IsBoolean()
  snoozeEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  snoozeDuration?: number;

  @IsOptional()
  @IsBoolean()
  preventSleepAgain?: boolean;
}
