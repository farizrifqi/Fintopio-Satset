export type DiamondState = 'available' | 'unavailable';
export type DiamondNumber = number;

interface boosts {
  [key: string]: {
    id: number;
    price: string;
    quantity: string;
    type: string;
  };
}

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
  rewards: {
    gem: {
      name: string;
    };
    hold: {
      amount: string;
    };
    voucher: null | string;
  };
  boosts: boosts[];
}
