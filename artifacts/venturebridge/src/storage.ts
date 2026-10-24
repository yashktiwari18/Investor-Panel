import type { DemoData, Venture } from './types';

const STORAGE_KEY = 'venturebridge-demo-v1';

const seed: DemoData = {
  ventures: [
    {
      id: 'vb-1042', founder: 'Maya Chen', university: 'Northwestern University', email: 'maya.chen@northwestern.edu',
      name: 'Fieldnote', tagline: 'Field research, without the paperwork.',
      category: 'Education technology',
      description: 'Fieldnote gives university research teams a shared workspace for collecting, tagging, and synthesizing interviews in the field. Offline-first capture keeps teams moving in low-connectivity environments, while structured templates make qualitative research easier to audit and share.',
      businessModel: 'Annual team subscriptions for research labs, with a free plan for student projects.',
      useOfFunds: 'Product engineering, accessibility testing, and pilot support for three university research labs.',
      requestedAmount: 24000, approvedBudget: 18000, status: 'Approved',
      feedback: 'Strong validation and a clear pilot pathway. The committee approved a focused first-phase budget.',
      createdAt: '2025-02-14', interests: ['Northstar Ventures'],
    },
    {
      id: 'vb-1038', founder: 'Jordan Ellis', university: 'University of Michigan', email: 'jordan.ellis@umich.edu',
      name: 'Loopwell', tagline: 'A second life for campus materials.',
      category: 'Climate & sustainability',
      description: 'Loopwell helps campus departments rehome surplus lab and studio materials before they become waste. A verified exchange network makes listings searchable by location, condition, and safety requirements.',
      businessModel: 'Campus licensing with optional logistics and inventory services.',
      useOfFunds: 'Build the campus inventory system and run two semester-long pilots.',
      requestedAmount: 32000, approvedBudget: 25000, status: 'Approved',
      feedback: 'Approved to support the two-campus pilot. Share quarterly reuse metrics with the program team.',
      createdAt: '2025-02-08', interests: [],
    },
    {
      id: 'vb-1031', founder: 'Priya Raman', university: 'Georgia Institute of Technology', email: 'priya.raman@gatech.edu',
      name: 'CommonGround', tagline: 'Make local food easier to find.',
      category: 'Food & agriculture',
      description: 'CommonGround connects independent food growers with neighborhood buyers through simple preorder windows and shared pickup points.',
      businessModel: 'A small transaction fee on orders, with a subscription tier for growers.',
      useOfFunds: 'Improve grower onboarding and validate unit economics across two neighborhoods.',
      requestedAmount: 18500, approvedBudget: 15000, status: 'Approved',
      feedback: 'Approved with a staged budget. Prioritize repeat purchase data before expanding the footprint.',
      createdAt: '2025-01-29', interests: ['Northstar Ventures', 'Avery Brooks'],
    },
    {
      id: 'vb-1026', founder: 'Sam Okafor', university: 'University of Pennsylvania', email: 'sam.okafor@upenn.edu',
      name: 'Tandem Health', tagline: 'Care coordination that starts with students.',
      category: 'Health & wellness',
      description: 'Tandem is a consent-first tool that helps campus care teams coordinate referrals and follow-up for students navigating multiple support services.',
      businessModel: 'Institutional annual contracts, with implementation support.',
      useOfFunds: 'Complete privacy review, build the referral workflow, and conduct a supervised campus pilot.',
      requestedAmount: 40000, status: 'Revision requested',
      feedback: 'Please clarify the scope of the initial pilot and explain how student consent is documented across care teams.',
      createdAt: '2025-02-18', interests: [],
    },
    {
      id: 'vb-1019', founder: 'Leo Martinez', university: 'University of Texas at Austin', email: 'leo.martinez@utexas.edu',
      name: 'Benchspace', tagline: 'Book the equipment your project needs.',
      category: 'Marketplace',
      description: 'Benchspace makes underused fabrication and prototyping equipment bookable by student teams across campus.',
      businessModel: 'Department subscriptions and a modest booking fee.',
      useOfFunds: 'Test equipment onboarding workflows with engineering departments.',
      requestedAmount: 15000, status: 'Under review',
      feedback: '', createdAt: '2025-02-20', interests: [],
    },
    {
      id: 'vb-1008', founder: 'Aisha Patel', university: 'Boston University', email: 'aisha.patel@bu.edu',
      name: 'OpenShelf', tagline: 'Course materials that travel further.',
      category: 'Education technology',
      description: 'OpenShelf helps student organizations organize and share accessible course guides and study resources.',
      businessModel: 'Free student access supported by institutional partnerships.',
      useOfFunds: 'Build the first accessible content library and recruit student contributors.',
      requestedAmount: 12000, status: 'Not selected',
      feedback: 'The team appreciated your thoughtful submission. We are unable to fund this round; please consider applying again with early pilot results.',
      createdAt: '2025-01-17', interests: [],
    },
  ],
};

export function loadDemoData(): DemoData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seed);
    const parsed = JSON.parse(raw) as DemoData;
    if (!parsed || !Array.isArray(parsed.ventures)) return structuredClone(seed);
    return parsed;
  } catch {
    return structuredClone(seed);
  }
}

export function saveDemoData(data: DemoData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // The in-memory prototype remains usable when browser storage is unavailable.
  }
}

export function resetDemoData(): DemoData {
  const fresh = structuredClone(seed);
  saveDemoData(fresh);
  return fresh;
}

export function createVenture(input: Omit<Venture, 'id' | 'status' | 'feedback' | 'createdAt' | 'interests'>): Venture {
  return {
    ...input,
    id: `vb-${Date.now().toString().slice(-6)}`,
    status: 'Under review',
    feedback: '',
    createdAt: new Date().toISOString().slice(0, 10),
    interests: [],
  };
}
