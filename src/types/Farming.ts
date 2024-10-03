export type FarmingState = 'farming' | 'idling' | 'farmed';
export interface FarmingStateResponse {
  state: FarmingState;
  farmed?: number;
  timings?: {
    start?: number;
    finish?: number;
    left?: number;
  };
  settings?: {
    time?: number;
    amount?: string;
    interval?: number;
    reward?: string;
  };
  isAutocollectEnabled?: boolean;
}
