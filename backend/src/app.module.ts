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
import { Friendship } from '@domain/entities/friendship.entity';

// Repositories
import {
  UserRepository,
  AlarmRepository,
  MissionRepository,
  AlarmHistoryRepository,
  MissionAttemptRepository,
} from '@infrastructure/repositories';
import { FriendshipRepository } from '@infrastructure/repositories/friendship.repository';

// Repository Interfaces (for DI)
import {
  IUserRepository,
  IAlarmRepository,
  IMissionRepository,
  IAlarmHistoryRepository,
  IMissionAttemptRepository,
} from '@domain/repositories';
import { IFriendshipRepository } from '@domain/repositories/friendship.repository.interface';

// Use Cases
import { RegisterUserUseCase } from '@application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '@application/use-cases/auth/login-user.use-case';
import { CreateAlarmUseCase } from '@application/use-cases/alarm/create-alarm.use-case';
import { UpdateFinancialProfileUseCase } from '@application/use-cases/user/update-financial-profile.use-case';
import { GetWeatherUseCase } from '@application/use-cases/weather/get-weather.use-case';
import { GetGlobalLeaderboardUseCase } from '@application/use-cases/leaderboard/get-global-leaderboard.use-case';
import { GetFriendsLeaderboardUseCase } from '@application/use-cases/leaderboard/get-friends-leaderboard.use-case';

// Controllers
import { AuthController } from '@presentation/controllers/auth.controller';
import { AlarmController } from '@presentation/controllers/alarm.controller';
import { WeatherController } from '@presentation/controllers/weather.controller';
import { LeaderboardController } from '@presentation/controllers/leaderboard.controller';

// Services
import { WeatherService } from '@infrastructure/services/weather.service';
import { IWeatherService } from '@domain/services/weather.service.interface';

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
      Friendship,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        return {
          secret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  controllers: [AuthController, AlarmController, WeatherController, LeaderboardController],
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
    {
      provide: 'IFriendshipRepository',
      useClass: FriendshipRepository,
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
    {
      provide: GetWeatherUseCase,
      useFactory: (weatherService: IWeatherService) => new GetWeatherUseCase(weatherService),
      inject: ['IWeatherService'],
    },
    {
      provide: GetGlobalLeaderboardUseCase,
      useFactory: (userRepo: IUserRepository) => new GetGlobalLeaderboardUseCase(userRepo),
      inject: ['IUserRepository'],
    },
    {
      provide: GetFriendsLeaderboardUseCase,
      useFactory: (userRepo: IUserRepository, friendshipRepo: IFriendshipRepository) =>
        new GetFriendsLeaderboardUseCase(userRepo, friendshipRepo),
      inject: ['IUserRepository', 'IFriendshipRepository'],
    },

    // Services
    {
      provide: 'IWeatherService',
      useClass: WeatherService,
    },
  ],
})
export class AppModule {}
