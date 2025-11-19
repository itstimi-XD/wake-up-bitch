import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MissionType, DifficultyLevel } from '@shared/enums';

export class AlarmMissionDto {
  @IsEnum(MissionType)
  missionType: MissionType;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsNumber()
  @Min(0)
  sequenceOrder: number;

  @IsOptional()
  config?: Record<string, any>;
}

export class CreateAlarmDto {
  @IsString()
  name: string;

  @IsString()
  time: string; // HH:MM format

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  daysOfWeek: number[];

  @IsString()
  soundId: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlarmMissionDto)
  missions?: AlarmMissionDto[];
}
