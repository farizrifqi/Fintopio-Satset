export type BearerToken = string;
export type QueryID = string;
export interface BotIdentifier {
  username?: string;
  telegramId?: string;
}

export interface AuthResponse {
  token: BearerToken;
  need2fa?: boolean;
}
