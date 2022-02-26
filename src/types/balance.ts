export interface Balance {
  balance: number;
  balance_including_flexible_savings: number;
  currency: string;
  local_currency: string;
  local_exchange_rate: number;
  spend_today: number;
  total_balance: number;
}
