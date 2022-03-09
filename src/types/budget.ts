export interface Adjustment {
  paymentId: string;
  id: string;
  date?: Date;
  name: string;
  amount: string;
}

interface PotPlan {
  id: string;
  balance: string;
  name: string;
  adjustments: Adjustment[];
}

export interface Budget {
  fromDate: Date;
  toDate: Date;
  potPlans: PotPlan[];
}
