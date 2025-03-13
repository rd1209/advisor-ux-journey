
export interface Customer {
  id: string;
  name: string;
  lastName: string;
  creditScore: number;
  income: number;
  age: number;
  address: string;
  phone: string;
  email: string;
  products: OwnedProduct[];
  preferences: string[];
  propensity: {
    creditCards: number;
    loans: number;
    insurance: number;
    savings: number;
  };
}

export interface OwnedProduct {
  id: string;
  type: 'creditCard' | 'loan' | 'insurance' | 'savings';
  name: string;
  balance?: number;
  limit?: number;
  rate?: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface Product {
  id: string;
  type: 'creditCard' | 'loan' | 'insurance' | 'savings';
  name: string;
  description: string;
  benefits: string[];
  requirements: string[];
  terms: string[];
  imageUrl?: string;
  interestRate?: {
    min: number;
    max: number;
  };
  limit?: {
    min: number;
    max: number;
  };
}

export interface Performance {
  daily: {
    sales: number;
    goal: number;
  };
  weekly: {
    sales: number;
    goal: number;
  };
  monthly: {
    sales: number;
    goal: number;
  };
  products: {
    creditCards: number;
    loans: number;
    insurance: number;
    savings: number;
  };
  badges: Badge[];
  level: {
    current: number;
    progress: number;
    nextMilestone: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

export interface CallInfo {
  customerId: string;
  duration: number;
  status: 'active' | 'waiting' | 'completed';
  startTime: Date;
}

export interface ApplicationState {
  currentCustomer: Customer | null;
  nextCustomer: Customer | null;
  currentCall: CallInfo | null;
  performance: Performance;
  productCatalog: Product[];
}
