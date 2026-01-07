
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

export interface Transaction {
  id: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  amount: number;
  charge: number;
  type: 'send' | 'receive' | 'add_money';
  note?: string;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastTimestamp?: number;
}
