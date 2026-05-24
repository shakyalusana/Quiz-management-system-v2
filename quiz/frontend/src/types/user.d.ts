export interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  roles?: string[];
  scopes?: string[];
}

export type AssetFinance = {
  purchaseCost: number;
  depreciationValue: number;
  maintenanceCost: number;
  resaleValue: number;
  purchaseDate: string;
  warranty: string;
  supplierName: string;
  supplierContact: string;
  purchaseReceipt: string;
} | null;

// Assets
export type Asset = {
  id: string;
  name: string;
  serialNumber: string;
  usefulLife: number;
  imageUrl: string;
  fiscalYearId: string;
  assetFinance?: AssetFinance;
  category: CommonType;
  branch: CommonType;
  department: CommonType;
  fiscalYear: CommonType;
  categoryId?: ICategory;
  client_BranchId?: IBranch;
  departmentId?: IDepartment;
  depreciation?: Depreciation;
  approvalStatus: "pending" | "approved" | "rejected" | string;
  approvalMessage?: string;
};

interface Depreciation {
  totalDepreciation: number;
  remainingAmountAfterDepreciation: number;
  yearsPassed: number;
}

interface CommonType {
  id: string;
  name: string;
  code?: string;
  state?: string;
  district?: string;
  addressLine?: string;
  statdate?: string;
  enddata?: string;
}
export type AssetWithApproval = Asset & {
  status?: string;
  approvalStatus?: string;
};

export type StatusKey = "approval_pending" | "approved" | "rejected" | string;
export type AssetStatus = "pending" | "approved" | "rejected" | "assigned";

export type LookupObj = {
  id?: string | number;
  name?: string;
  code?: string;
};
export interface AssetListItem extends Omit<Asset, "approvalStatus"> {
  status?: AssetStatus | string;
  approvalStatus?: string;
  category?: string | LookupObj;
}

export interface RoleScope {
  roleId: string;
  scopeAuthorizationStatus: ScopeAuthorizationStatus[];
}

export interface ScopeAuthorizationStatus {
  scope: string;
  isAuthorized: boolean;
}
export interface Role {
  id: string;
  name: string;
  roleScope: RoleScope;
}

export interface UserData {
  id?: string;
  userName?: string;
  name?: string;
  phone?: string;
  role?: Role;
  email?: string;
}

export interface Branches {
  name: string;
  id?: string;
  code: string;
  state: string;
  district: string;
  addressLine?: string;
  createdAt?: string;
  updatedAt?: string;
}

// keys
export type SortDir = "asc" | "desc" | string;
export type SortKey = "asset" | "status" | "category" | "serialNumber" | string;

export interface EventLog {
  id?: string;
  eventType?: string;
  eventName?: string;
  createdBy?: string;
  createdAt?: string;
  description?: string;
  entityId?: string;
}

// department

export interface DepartmentItem {
  id?: string | number;
  name?: string;
  code?: string;
}

export type DepartmentRow = {
  id: string | number;
  name: string;
  code: string;
};

// branches
export interface BranchItem {
  id?: string | number;
  name: string;
  code?: string;
  state: string;
  district: string;
  addressLine: string;
}

export interface BranchRow {
  id: string | number;
  name: string;
  code: string;
  state: string;
  district: string;
  addressLine: string;
}

export interface Branch {
  id: string | number;
  name: string;
  code: string;
  state: string;
  district: string;
  addressLine: string;
}

export interface FiscalYearItem {
  id: string;
  name: string;
  startdate: Date;
  enddate: Date;
  status: boolean;
}

export interface CategoryItem {
  id?: string | number;
  name: string;
  code?: string;
}
export interface CategoryRow {
  id: string | number;
  name: string;
  code: string;
}

export interface FinanceList {
  id: string;
  name: string;
  serialNumber: string;
  assetFinance?: {
    purchaseDate: string;
    purchaseCost: number;
    depreciation: Depreciation;
  } | null;
  category?: { id: string; name: string } | null;
  branch?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
  fiscalYear?: { id: string; name: string } | null;
}

// organizations

export interface Organization {
  guid: string;
  isAuthorized: boolean;
  createdAt: string;
  createdBy: string;
  company: {
    name: string;
  };
}

// organization Users
export interface OrganizationUser {
  id: string;
  userName: string;
  email: string;
  role: Role;
}

// reports
export interface Report {
  id: string;
  ids?: string[];
  name?: string;
  reportType?: string;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  description?: string;
}
