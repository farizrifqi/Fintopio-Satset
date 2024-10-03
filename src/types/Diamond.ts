export type DiamondState = 'available' | 'unavailable';
export type DiamondNumber = number;
export interface clickerDiamondState {
  state: DiamondState;
  clicks: number;
  diamondNumber: DiamondNumber;
  isInstantPlay: boolean;
  timings: {
    availableFrom: number;
    availableTo: number;
    nextAt: number;
  };
  settings: {
    clickTimeout: number;
    clickReward: string;
    totalReward: string;
    baseGem: string;
  };
  rewards: any;
  boosts: any;
}
