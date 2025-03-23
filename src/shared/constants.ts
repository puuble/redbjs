export const TokenExpiry = {
  hourly: "1h",
  daily: "1d",
  weekly: "7d",
  monthly: "30d",
} as const;

export type TokenExpiryKey = keyof typeof TokenExpiry;

export const DEFAULT_TOKEN_EXPIRES_IN: TokenExpiryKey = "hourly";
