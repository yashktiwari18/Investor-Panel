export type UserRole = 'student' | 'investor' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string; // Plaintext for demo/local evaluation
  role: UserRole;
  university?: string;
  projectName?: string;
  category?: string;
  firmName?: string;
  investorType?: string;
  ticketSize?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
  signedInAt: string;
}

const USERS_STORAGE_KEY = 'ideabridge-registered-users-v1';
const SESSION_STORAGE_KEY = 'ideabridge-auth-session-v1';

// Pre-seeded registered accounts for testing
export const INITIAL_SEEDED_USERS: UserAccount[] = [
  {
    id: 'user-maya',
    name: 'Maya Chen',
    email: 'maya.chen@iitb.ac.in',
    password: 'Founder@123',
    role: 'student',
    university: 'IIT Bombay',
    projectName: 'GreenRoots Bio-Packaging',
    category: 'Environment',
    createdAt: '2025-01-10',
  },
  {
    id: 'user-rohit',
    name: 'Rohit Verma',
    email: 'rohit.v@iitkgp.ac.in',
    password: 'Founder@123',
    role: 'student',
    university: 'IIT Kharagpur',
    projectName: 'Smart Farming AI',
    category: 'Agritech',
    createdAt: '2025-01-15',
  },
  {
    id: 'user-northstar',
    name: 'Karan Malhotra',
    firmName: 'Northstar Ventures',
    email: 'deals@northstarvc.in',
    password: 'Investor@123',
    role: 'investor',
    investorType: 'Angel Syndicate',
    ticketSize: '15-30',
    createdAt: '2025-01-05',
  },
  {
    id: 'user-cleanplanet',
    name: 'Sneha Patel',
    firmName: 'CleanPlanet Capital',
    email: 'seed@cleanplanet.io',
    password: 'Investor@123',
    role: 'investor',
    investorType: 'Climate & ESG Fund',
    ticketSize: '10-15',
    createdAt: '2025-01-08',
  },
  {
    id: 'user-admin',
    name: 'Morgan Lee',
    email: 'admin@ideabridge.io',
    password: 'Admin@123',
    role: 'admin',
    createdAt: '2025-01-01',
  },
];

/**
 * Validates password rules for account creation:
 * 1. At least 8 characters long
 * 2. Contains at least one special character
 * 3. Matches confirmPassword (if provided)
 */
export function validateNewPassword(
  password: string,
  confirmPassword?: string
): { isValid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long.',
    };
  }

  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
  if (!specialCharRegex.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character (e.g. @, #, $, !, %, *, ?).',
    };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match. Please ensure Password and Confirm Password are identical.',
    };
  }

  return { isValid: true };
}

export function getRegisteredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      saveRegisteredUsers(INITIAL_SEEDED_USERS);
      return INITIAL_SEEDED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure seeded passwords have the special-char version available
      const mapped = parsed.map((u: UserAccount) => {
        if (u.email === 'maya.chen@iitb.ac.in' && u.password === 'founder123') {
          return { ...u, password: 'Founder@123' };
        }
        if (u.email === 'deals@northstarvc.in' && u.password === 'investor123') {
          return { ...u, password: 'Investor@123' };
        }
        if (u.email === 'seed@cleanplanet.io' && u.password === 'investor123') {
          return { ...u, password: 'Investor@123' };
        }
        return u;
      });
      return mapped;
    }
    saveRegisteredUsers(INITIAL_SEEDED_USERS);
    return INITIAL_SEEDED_USERS;
  } catch {
    return INITIAL_SEEDED_USERS;
  }
}

export function saveRegisteredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // LocalStorage quota or unavailable fallback
  }
}

export interface RegisterResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
  university?: string;
  projectName?: string;
  category?: string;
  firmName?: string;
  investorType?: string;
  ticketSize?: string;
}): RegisterResult {
  // Validate password rules (min 8 chars, 1 special char, matches confirmPassword)
  const validation = validateNewPassword(input.password, input.confirmPassword);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const users = getRegisteredUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  // Check if an account already exists with this email
  const existing = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: `An account with email "${input.email}" already exists. Please log in with your password.`,
    };
  }

  const newUser: UserAccount = {
    id: `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: input.name.trim(),
    email: normalizedEmail,
    password: input.password,
    role: input.role,
    university: input.university?.trim(),
    projectName: input.projectName?.trim(),
    category: input.category,
    firmName: input.firmName?.trim(),
    investorType: input.investorType,
    ticketSize: input.ticketSize,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const updatedUsers = [...users, newUser];
  saveRegisteredUsers(updatedUsers);

  return {
    success: true,
    user: newUser,
  };
}

export interface LoginResult {
  success: boolean;
  user?: UserAccount;
  session?: AuthSession;
  error?: string;
}

export function loginUser(
  email: string,
  password: string,
  expectedRole?: UserRole
): LoginResult {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: `No account found for "${email}". Please sign up / register first.`,
    };
  }

  // Check password (allow both standard and legacy demo password)
  const passwordMatches =
    user.password === password ||
    (password === 'founder123' && user.password === 'Founder@123') ||
    (password === 'investor123' && user.password === 'Investor@123') ||
    (password === 'admin123' && user.password === 'Admin@123');

  if (!passwordMatches) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.',
    };
  }

  if (expectedRole && user.role !== expectedRole) {
    const roleLabels: Record<UserRole, string> = {
      student: 'Student Creator / Founder',
      investor: 'Investor',
      admin: 'Administrator',
    };
    return {
      success: false,
      error: `This account is registered as a ${roleLabels[user.role]}. Please sign in through the ${roleLabels[user.role]} portal.`,
    };
  }

  const session: AuthSession = {
    user,
    token: `token-${user.id}-${Date.now().toString(36)}`,
    signedInAt: new Date().toISOString(),
  };

  saveCurrentSession(session);

  return {
    success: true,
    user,
    session,
  };
}

export function getCurrentSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user?.id && parsed?.user?.role) {
      return parsed as AuthSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCurrentSession(session: AuthSession): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage quota fallback
  }
}

export function clearCurrentSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Storage quota fallback
  }
}
