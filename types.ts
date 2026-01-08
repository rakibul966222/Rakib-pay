
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  pinHash?: string;
  balance: number;
  profilePhoto?: string;
  createdAt: number;
  kycStatus: 'pending' | 'verified' | 'unverified';
}

export type TransactionCategory = 'Food' | 'Shopping' | 'Utilities' | 'Travel' | 'Entertainment' | 'Others';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  amount: number;
  charge: number;
  type: 'send' | 'receive' | 'add_money';
  category?: TransactionCategory;
  note?: string;
  timestamp: number;
  participants: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAI?: boolean;
}
