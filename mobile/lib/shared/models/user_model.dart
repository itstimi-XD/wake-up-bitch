import 'package:equatable/equatable.dart';

class UserModel extends Equatable {
  final String id;
  final String email;
  final String username;
  final String? profileImage;
  final String timezone;
  final FinancialProfile? financialProfile;

  const UserModel({
    required this.id,
    required this.email,
    required this.username,
    this.profileImage,
    required this.timezone,
    this.financialProfile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      username: json['username'] as String,
      profileImage: json['profileImage'] as String?,
      timezone: json['timezone'] as String,
      financialProfile: json['financialProfile'] != null
          ? FinancialProfile.fromJson(
              json['financialProfile'] as Map<String, dynamic>,
            )
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'profileImage': profileImage,
      'timezone': timezone,
      'financialProfile': financialProfile?.toJson(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        email,
        username,
        profileImage,
        timezone,
        financialProfile,
      ];
}

class FinancialProfile extends Equatable {
  final IncomeInfo income;
  final ExpensesInfo fixedExpenses;
  final CreditCardInfo creditCard;
  final CalculatedMetrics calculated;

  const FinancialProfile({
    required this.income,
    required this.fixedExpenses,
    required this.creditCard,
    required this.calculated,
  });

  factory FinancialProfile.fromJson(Map<String, dynamic> json) {
    return FinancialProfile(
      income: IncomeInfo.fromJson(json['income'] as Map<String, dynamic>),
      fixedExpenses:
          ExpensesInfo.fromJson(json['fixedExpenses'] as Map<String, dynamic>),
      creditCard:
          CreditCardInfo.fromJson(json['creditCard'] as Map<String, dynamic>),
      calculated: CalculatedMetrics.fromJson(
          json['calculated'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'income': income.toJson(),
      'fixedExpenses': fixedExpenses.toJson(),
      'creditCard': creditCard.toJson(),
      'calculated': calculated.toJson(),
    };
  }

  @override
  List<Object?> get props => [income, fixedExpenses, creditCard, calculated];
}

class IncomeInfo extends Equatable {
  final double salary;
  final double sideHustle;
  final double other;
  final double total;

  const IncomeInfo({
    required this.salary,
    required this.sideHustle,
    required this.other,
    required this.total,
  });

  factory IncomeInfo.fromJson(Map<String, dynamic> json) {
    return IncomeInfo(
      salary: (json['salary'] as num).toDouble(),
      sideHustle: (json['sideHustle'] as num).toDouble(),
      other: (json['other'] as num).toDouble(),
      total: (json['total'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'salary': salary,
      'sideHustle': sideHustle,
      'other': other,
      'total': total,
    };
  }

  @override
  List<Object?> get props => [salary, sideHustle, other, total];
}

class ExpensesInfo extends Equatable {
  final double rent;
  final double utilities;
  final double insurance;
  final double loan;
  final double subscriptions;
  final double transportation;
  final double other;
  final double total;

  const ExpensesInfo({
    required this.rent,
    required this.utilities,
    required this.insurance,
    required this.loan,
    required this.subscriptions,
    required this.transportation,
    required this.other,
    required this.total,
  });

  factory ExpensesInfo.fromJson(Map<String, dynamic> json) {
    return ExpensesInfo(
      rent: (json['rent'] as num).toDouble(),
      utilities: (json['utilities'] as num).toDouble(),
      insurance: (json['insurance'] as num).toDouble(),
      loan: (json['loan'] as num).toDouble(),
      subscriptions: (json['subscriptions'] as num).toDouble(),
      transportation: (json['transportation'] as num).toDouble(),
      other: (json['other'] as num).toDouble(),
      total: (json['total'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'rent': rent,
      'utilities': utilities,
      'insurance': insurance,
      'loan': loan,
      'subscriptions': subscriptions,
      'transportation': transportation,
      'other': other,
      'total': total,
    };
  }

  @override
  List<Object?> get props => [
        rent,
        utilities,
        insurance,
        loan,
        subscriptions,
        transportation,
        other,
        total,
      ];
}

class CreditCardInfo extends Equatable {
  final double thisMonthSpent;
  final int paymentDay;

  const CreditCardInfo({
    required this.thisMonthSpent,
    required this.paymentDay,
  });

  factory CreditCardInfo.fromJson(Map<String, dynamic> json) {
    return CreditCardInfo(
      thisMonthSpent: (json['thisMonthSpent'] as num).toDouble(),
      paymentDay: json['paymentDay'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'thisMonthSpent': thisMonthSpent,
      'paymentDay': paymentDay,
    };
  }

  @override
  List<Object?> get props => [thisMonthSpent, paymentDay];
}

class CalculatedMetrics extends Equatable {
  final double dailyExpense;
  final double hourlyExpense;
  final double minuteExpense;
  final double disposableIncome;

  const CalculatedMetrics({
    required this.dailyExpense,
    required this.hourlyExpense,
    required this.minuteExpense,
    required this.disposableIncome,
  });

  factory CalculatedMetrics.fromJson(Map<String, dynamic> json) {
    return CalculatedMetrics(
      dailyExpense: (json['dailyExpense'] as num).toDouble(),
      hourlyExpense: (json['hourlyExpense'] as num).toDouble(),
      minuteExpense: (json['minuteExpense'] as num).toDouble(),
      disposableIncome: (json['disposableIncome'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dailyExpense': dailyExpense,
      'hourlyExpense': hourlyExpense,
      'minuteExpense': minuteExpense,
      'disposableIncome': disposableIncome,
    };
  }

  @override
  List<Object?> get props => [
        dailyExpense,
        hourlyExpense,
        minuteExpense,
        disposableIncome,
      ];
}
