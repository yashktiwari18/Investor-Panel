export type Role = 'student' | 'admin' | 'investor';
export type VentureStatus = 'Under review' | 'Revision requested' | 'Approved' | 'Not selected';

export interface Venture {
  id: string;
  founder: string;
  university: string;
  email: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  businessModel: string;
  useOfFunds: string;
  requestedAmount: number;
  approvedBudget?: number;
  status: VentureStatus;
  feedback: string;
  createdAt: string;
  interests: string[];
}

export interface DemoData {
  ventures: Venture[];
}
