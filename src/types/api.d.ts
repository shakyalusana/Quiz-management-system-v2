export type LoginResponse = {
  token: string;
  message: string;
  code: string;
  user: {
    name: string;
    userName: string;
    roles?: string[];
  };
};

export type RegisterResponse = {
  message: string;
  code: string;
  data: Omit<LoginResponse["data"], "accessToken">;
};

export type UserResponse = {
  message: string;
  code: string;
  data: User;
};

export type AssetFinance = {
  purchaseCost: number;
} | null;

export type AssetsResponse = {
  message: string;
  code: string;
  data: Asset[];
};

// fiscal year
export type FiscalYearAPIPayload = {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  status: boolean;
};

export type ReportAPIPayload = {
  name: string;
  reportType: string;
  from?: string;
  to?: string;
};

export interface AssetDistribution {
  [key: string]: string | number;
  categoryName: string;
  percentage: number;
  totalPurchaseCost: number;
  totalDepreciationAmount: number;
  totalMaintenanceCost: number;
  totalResaleAmount: number;
}

export interface PieChartComponentProps {
  data?: AssetDistribution[];
  isLoading?: boolean;
}

export interface FinanceBreakdownProps {
  data?: AssetDistribution[];
  isLoading?: boolean;
}

export interface FinancialSummary {
  totalPurchaseCost: number;
  totalDepreciationAmount: number;
  totalMaintenanceCost: number;
  totalResaleAmount: number;
}

export interface FinancialSummaryProps {
  financialSummary?: FinancialSummary;
  isLoading?: boolean;
}

export interface RoleListApiResponse {
  message: string;
  code: string;
  data: Role[];
}

// organization api respone
export type OrganizationResponse = {
  message: string;
  code: string;
  data: Organization[];
};

// organization user api response
export type OrganizationUserResponse = {
  message: string;
  code: string;
  data: OrganizationUser[];
};
