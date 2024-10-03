import { BearerToken, QueryID } from './Auth';

export interface InitData {
  queryId: QueryID;
  bearerToken?: BearerToken;
}

export interface InitOptions {
  farming?: boolean;
  verbose?: boolean;
}
