import { clickerDiamondState } from './Diamond';

export interface FastInitResponse {
  referralData: {
    isDailyRewardClaimed: boolean;
    claimableTasks: number;
    balance: string;
    activations: {
      used: number;
      total: number;
    };
    lastReferrals: any;
    rewardPercent: any;
    url: string;
    level: any;
    leaderboard: {
      position: number;
    };
  };
  clickerDiamondState: clickerDiamondState;
}
