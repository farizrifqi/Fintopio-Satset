interface DailyReward {
  reward: number;
  status: 'now' | 'unclaimed' | 'claimed';
}
export interface DailyCheckinResponse {
  claimed: boolean;
  balance: boolean;
  totalDays: boolean;
  dailyReward: boolean;
  rewards: DailyReward[];
}
