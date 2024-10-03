import { BearerToken, QueryID } from './Auth';
type Job = 'daily' | 'farming' | 'diamond';

export interface InitData {
  queryId: QueryID;
  bearerToken?: BearerToken;
}

export interface InitOptions {
  jobs?: JobOptions;
  verbose?: boolean;
}

export type JobOptions = {
  [K in Job]: boolean;
};
