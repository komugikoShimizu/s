export type MenuKey = 'login' | 'ledger' | 'ledger-create';

export type SummaryCard = {
  label: string;
  value: string;
  note: string;
};

export type Transaction = {
  id: number;
  date: string;
  category: string;
  detail: string;
  amount: string;
  type: 'income' | 'expense';
};

export type BudgetItem = {
  category: string;
  used: string;
  budget: string;
  progress: number;
};

export type CategoryInsight = {
  category: string;
  consumptionStatus: string;
  usageRate: string;
  trend: string;
  trendNote: string;
  assetValue: string;
  assetDelta: string;
  highlight: string;
};

export type LoginContent = {
  title: string;
  description: string;
  fields: string[];
};

export type LedgerCreateContent = {
  title: string;
  description: string;
  defaultDate: string;
  defaultType: 'income' | 'expense';
  defaultCategory: string;
};

export type UiSnapshot = {
  login: LoginContent;
  ledger: {
    summaryCards: SummaryCard[];
    transactions: Transaction[];
    monthlyBudgets: BudgetItem[];
    categoryInsights: Record<string, CategoryInsight>;
  };
  ledgerCreate: LedgerCreateContent;
};

export type DataSource = 'mock' | 'local' | 'backend';
