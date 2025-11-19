import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Alarm } from './alarm.entity';
import { AlarmHistory } from './alarm-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string | null;

  @Column({ length: 50, default: 'UTC' })
  timezone: string;

  @Column({ name: 'fcm_token', type: 'text', nullable: true })
  fcmToken: string | null;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: string | null;

  // Gamification
  @Column({ type: 'integer', default: 0 })
  points: number;

  @Column({ name: 'weekly_points', type: 'integer', default: 0 })
  weeklyPoints: number;

  @Column({ name: 'successful_alarms', type: 'integer', default: 0 })
  successfulAlarms: number;

  @Column({ name: 'failed_alarms', type: 'integer', default: 0 })
  failedAlarms: number;

  @Column({ name: 'current_streak', type: 'integer', default: 0 })
  currentStreak: number;

  @Column({ name: 'longest_streak', type: 'integer', default: 0 })
  longestStreak: number;

  // Financial profile for BILLS_DUE mission
  @Column({ type: 'jsonb', nullable: true, name: 'financial_profile' })
  financialProfile: {
    income: {
      salary: number;
      sideHustle: number;
      other: number;
      total: number;
    };
    fixedExpenses: {
      rent: number;
      utilities: number;
      insurance: number;
      loan: number;
      subscriptions: number;
      transportation: number;
      other: number;
      total: number;
    };
    creditCard: {
      thisMonthSpent: number;
      paymentDay: number;
    };
    calculated: {
      dailyExpense: number;
      hourlyExpense: number;
      minuteExpense: number;
      disposableIncome: number;
    };
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  // Relations
  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];

  @OneToMany(() => AlarmHistory, (history) => history.user)
  alarmHistories: AlarmHistory[];

  // Domain methods
  calculateFinancialMetrics(): void {
    if (!this.financialProfile) return;

    const { income, fixedExpenses } = this.financialProfile;

    // Calculate totals
    income.total = income.salary + income.sideHustle + income.other;
    fixedExpenses.total =
      fixedExpenses.rent +
      fixedExpenses.utilities +
      fixedExpenses.insurance +
      fixedExpenses.loan +
      fixedExpenses.subscriptions +
      fixedExpenses.transportation +
      fixedExpenses.other;

    // Calculate metrics
    const disposableIncome = income.total - fixedExpenses.total;
    const dailyExpense = fixedExpenses.total / 30;
    const hourlyExpense = dailyExpense / 24;
    const minuteExpense = hourlyExpense / 60;

    this.financialProfile.calculated = {
      dailyExpense,
      hourlyExpense,
      minuteExpense,
      disposableIncome,
    };
  }

  updateFinancialProfile(profile: Partial<User['financialProfile']>): void {
    this.financialProfile = {
      ...this.financialProfile,
      ...profile,
    } as User['financialProfile'];
    this.calculateFinancialMetrics();
  }
}
