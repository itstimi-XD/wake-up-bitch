import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Entities
import {
  User,
  Alarm,
  Mission,
  AlarmMission,
  AlarmHistory,
  MissionAttempt,
} from '@domain/entities';

// Repositories
import {
  UserRepository,
  AlarmRepository,
  MissionRepository,
  AlarmHistoryRepository,
  MissionAttemptRepository,
} from '@infrastructure/repositories';

// Repository Interfaces (for DI)
import {
  IUserRepository,
  IAlarmRepository,
  IMissionRepository,
  IAlarmHistoryRepository,
  IMissionAttemptRepository,
} from '@domain/repositories';

// Use Cases
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '@application/use-cases/auth/login-user.use-case';
import { CreateAlarmUseCase } from '@application/use-cases/alarm/create-alarm.use-case';
import { UpdateFinancialProfileUseCase } from '@application/use-cases/user/update-financial-profile.use-case';

// Controllers
import { AuthController } from '@presentation/controllers/auth.controller';
import { AlarmController } from '@presentation/controllers/alarm.controller';

// Strategies
import { JwtStrategy } from '@presentation/strategies/jwt.strategy';

// Config
import { getTypeOrmConfig } from '@infrastructure/database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
    }),
    TypeOrmModule.forFeature([
      User,
      Alarm,
      Mission,
      AlarmMission,
      AlarmHistory,
      MissionAttempt,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController, AlarmController],
  providers: [
    // Strategies
    JwtStrategy,

    // Repositories
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IAlarmRepository',
      useClass: AlarmRepository,
    },
    {
      provide: 'IMissionRepository',
      useClass: MissionRepository,
    },
    {
      provide: 'IAlarmHistoryRepository',
      useClass: AlarmHistoryRepository,
    },
    {
      provide: 'IMissionAttemptRepository',
      useClass: MissionAttemptRepository,
    },

    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepo: IUserRepository) => new RegisterUserUseCase(userRepo),
      inject: ['IUserRepository'],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepo: IUserRepository, jwtService: any) =>
        new LoginUserUseCase(userRepo, jwtService),
      inject: ['IUserRepository', JwtModule],
    },
    {
      provide: CreateAlarmUseCase,
      useFactory: (alarmRepo: IAlarmRepository, missionRepo: IMissionRepository) =>
        new CreateAlarmUseCase(alarmRepo, missionRepo),
      inject: ['IAlarmRepository', 'IMissionRepository'],
    },
    {
      provide: UpdateFinancialProfileUseCase,
      useFactory: (userRepo: IUserRepository) => new UpdateFinancialProfileUseCase(userRepo),
      inject: ['IUserRepository'],
    },
  ],
})
export class AppModule {}
