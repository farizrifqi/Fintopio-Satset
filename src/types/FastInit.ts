import type { clickerDiamondState } from './Diamond';

export interface FastInitResponse {
  clickerDiamondState: clickerDiamondState;

  referralData: {
    isDailyRewardClaimed: boolean;
    claimableTasks: number;
    balance: string;
    activations: {
      used: number;
      total: number;
    };
    lastReferrals: unknown[];
    rewardPercent: unknown[];
    url: string;
    level: {
      name: string;
      rewardMultiplier: number;
    };
    leaderboard: {
      position: number;
    };
  };
}
