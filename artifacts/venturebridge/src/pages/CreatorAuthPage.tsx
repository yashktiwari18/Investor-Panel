import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { loginUser, registerUser, validateNewPassword } from '../auth';

export interface CreatorAuthData {
  name: string;
  email: string;
  university?: string;
  projectName?: string;
  category?: string;
}

interface CreatorAuthPageProps {
  onSuccess: (data: CreatorAuthData) => void;
  onBack: () => void;
  onSwitchToInvestor: () => void;
  initialMode?: 'login' | 'signup';
}

export default function CreatorAuthPage({
  onSuccess,
  onBack,
  onSwitchToInvestor,
  initialMode = 'login',
}: CreatorAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupUniversity, setSignupUniversity] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupProjectName, setSignupProjectName] = useState('');
  const [signupCategory, setSignupCategory] = useState('Agritech');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupTerms, setSignupTerms] = useState(true);

  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide both your email and password.');
      return;
    }

    // Real Authentication Check against registered users
    const result = loginUser(loginEmail, loginPassword, 'student');

    if (!result.success || !result.user) {
      setError(result.error || 'Login failed. Please check your credentials.');
      return;
    }

    // Authenticated successfully!
    onSuccess({
      name: result.user.name,
      email: result.user.email,
      university: result.user.university || 'Campus Innovator',
      projectName: result.user.projectName,
      category: result.user.category,
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!signupName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setError('Please provide your student or contact email.');
      return;
    }
    if (!signupUniversity.trim()) {
      setError('Please provide your university or college.');
      return;
    }

    // Validate password: 8 chars, 1 special char, matches confirm password
    const passValidation = validateNewPassword(signupPassword, signupConfirmPassword);
    if (!passValidation.isValid) {
      setError(passValidation.error || 'Invalid password.');
      return;
    }

    if (!signupTerms) {
      setError('Please agree to the founder guidelines.');
      return;
    }

    // Register user account in database / storage
    const result = registerUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
      role: 'student',
      university: signupUniversity.trim(),
      projectName: signupProjectName.trim(),
      category: signupCategory,
    });

    if (!result.success || !result.user) {
      setError(result.error || 'Registration failed. Please try again.');
      return;
    }

    // Success! New user must now log in with their created account
    setSuccessNotice(
      `🎉 Account created successfully for ${result.user.name}! Please enter your password below to log in.`
    );
    setLoginEmail(result.user.email);
    setLoginPassword('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setMode('login'); // Switch to login tab as requested!
  };

  // Demo auto-fill helpers
  const handleDemoLogin = (email = 'maya.chen@iitb.ac.in', pass = 'Founder@123') => {
    setMode('login');
    setLoginEmail(email);
    setLoginPassword(pass);
    setError('');
    setSuccessNotice('Pre-filled sample student founder credentials. Click "Log In" below.');
  };

  const handleDemoSignupFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSignupName('Rohan Gupta');
    setSignupUniversity('IIT Delhi');
    setSignupEmail(`rohan.gupta${randomSuffix}@iitd.ac.in`);
    setSignupProjectName('QuantumClean Filtration');
    setSignupCategory('Clean Energy');
    setSignupPassword('Student@123');
    setSignupConfirmPassword('Student@123');
    setError('');
    setSuccessNotice('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fb] via-[#eef4fb] to-[#e4eef9] text-[#1c2e45] selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-700"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Home</span>
            </button>

            {/* Logo */}
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2.5 text-left transition hover:opacity-90"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#14539a] via-[#1a6ec9] to-[#2e88ed] text-white shadow-sm ring-1 ring-blue-500/20">
                <GraduationCap className="size-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#0f2d52]">
                Idea<span className="text-[#1877f2]">Bridge</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-bold text-blue-700">
              <Sparkles className="size-3 text-amber-500 fill-amber-400" />
              <span>Student & Creator Portal</span>
            </span>

            <button
              type="button"
              onClick={onSwitchToInvestor}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <span>Investor Portal</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Branding, Value Prop & Testimonials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-bold text-blue-700 shadow-sm">
              <Rocket className="size-3.5 text-blue-600" />
              <span>List Your Project & Raise Grants</span>
            </div>

            <h1 className="font-[var(--app-font-serif)] text-3xl font-extrabold leading-[1.2] tracking-tight text-[#0f2d52] sm:text-4xl">
              Turn Your Campus Idea Into Real-World Impact
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              New founders must create an account first. Once registered, log in to verify your campus identity, submit your project details, and connect with active angels and grant committees.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">100% Campus-Verified Showcase</h2>
                  <p className="text-[11px] text-slate-500">
                    Your account links to your university affiliation to certify your collegiate venture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">₹ 2.4 Cr+ Grants & Angel Pool</h2>
                  <p className="text-[11px] text-slate-500">
                    Access non-dilutive campus grants and angel syndicates starting from ₹2 Lakhs up to ₹50 Lakhs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white/80 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">Secure Credentialed Access</h2>
                  <p className="text-[11px] text-slate-500">
                    Passwords must be at least 8 characters with at least one special character for enhanced security.
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Quote from Student */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm">
              <p className="text-xs italic text-slate-600">
                “IdeaBridge made listing our college project seamless. After creating my founder account and submitting our project, we were connected with two angel funds within a fortnight.”
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student Founder"
                  className="size-8 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Maya Chen</p>
                  <p className="text-[10px] text-slate-500">Founder, GreenRoots · IIT Bombay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-7">
            <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-blue-500/5">
              {/* Card Header & Tab Switcher */}
              <div className="mb-6 space-y-4 text-center sm:text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {mode === 'login' ? 'Founder Sign In' : 'Step 1: Create Account'}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {mode === 'login' ? 'Step 2 of 2' : 'Step 1 of 2'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0f2d52]">
                  {mode === 'login' ? 'Log In to List Your Project' : 'Create Your Founder Account'}
                </h2>
                <p className="text-xs text-slate-500">
                  {mode === 'login'
                    ? 'Enter your registered email and password to access the project submission form.'
                    : 'First create your student founder profile. After creating your account, you will log in to list your venture.'}
                </p>

                {/* Tab Pill Switcher */}
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className={`rounded-xl py-2 transition ${
                      mode === 'login'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    className={`rounded-xl py-2 transition ${
                      mode === 'signup'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account (Sign Up)
                  </button>
                </div>
              </div>

              {/* Fast Testing / Demo Helper */}
              {mode === 'login' ? (
                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="size-4 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-800">Quick Test (Seeded Account):</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('maya.chen@iitb.ac.in', 'Founder@123')}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Fill Maya Chen
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Maya Chen (IIT Bombay) · Password: <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">Founder@123</code>
                  </p>
                </div>
              ) : (
                <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-900">1-Click New Student Fill:</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoSignupFill}
                      className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      Fill New Student
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-800">
                    Auto-fills a new unique student to test creating an account with password matching.
                  </p>
                </div>
              )}

              {/* Success Notification Banner */}
              {successNotice && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>{successNotice}</div>
                </div>
              )}

              {/* Error Message Banner */}
              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{error}</p>
                    {error.includes('No account found') && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setSignupEmail(loginEmail);
                          setError('');
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-0.5 font-bold text-red-800 hover:bg-red-200"
                      >
                        <span>Click here to create account now</span>
                        <ArrowRight className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* LOGIN FORM (Only 1 password field - no confirm password on login) */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Registered Student Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. founder@iitb.ac.in"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset verification link would be sent to your student email.')}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative mt-1.5">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-founder"
                      defaultChecked
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-founder" className="text-xs text-slate-600">
                      Remember this browser session
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1264ce] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span>Log In & Continue to List Project</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="border-t border-slate-100 pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      New here? Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setError('');
                          setSuccessNotice('');
                        }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Sign Up First
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* SIGNUP FORM (With Password & Confirm Password matching) */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Maya Chen"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        University / Institution <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <GraduationCap className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupUniversity}
                          onChange={(e) => setSignupUniversity(e.target.value)}
                          placeholder="e.g. IIT Bombay"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Student / Contact Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="founder@college.edu"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Startup / Idea Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={signupProjectName}
                        onChange={(e) => setSignupProjectName(e.target.value)}
                        placeholder="e.g. GreenRoots"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Primary Sector
                      </label>
                      <select
                        value={signupCategory}
                        onChange={(e) => setSignupCategory(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="Agritech">Agritech</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Environment">Environment & CleanTech</option>
                        <option value="Retail">Retail & Consumer</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Service">Service & SaaS</option>
                        <option value="EdTech">EdTech</option>
                        <option value="Clean Energy">Clean Energy</option>
                      </select>
                    </div>
                  </div>

                  {/* PASSWORD & CONFIRM PASSWORD SECTION (Must match & have 8+ chars + special char) */}
                  <div className="space-y-1.5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700">
                          Create Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1.5">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showSignupPassword ? 'text' : 'password'}
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Min. 8 chars (e.g. Pass@123)"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label="Toggle password visibility"
                          >
                            {showSignupPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1.5">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showSignupConfirmPassword ? 'text' : 'password'}
                            required
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showSignupConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Must be at least 8 characters and include at least one special character (!@#$%^&* etc.)
                    </p>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="founder-terms"
                      checked={signupTerms}
                      onChange={(e) => setSignupTerms(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="founder-terms" className="text-[11px] leading-tight text-slate-600">
                      I agree to the IdeaBridge Community Guidelines and certify that I am a student or campus innovator.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1264ce] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span>Create Account (Sign Up)</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="border-t border-slate-100 pt-3 text-center">
                    <p className="text-xs text-slate-500">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setError('');
                          setSuccessNotice('');
                        }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Sign In with Password
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Bottom Switch to Investor */}
              <div className="mt-5 border-t border-slate-100 pt-3.5 text-center">
                <button
                  type="button"
                  onClick={onSwitchToInvestor}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition"
                >
                  Are you an angel investor or VC fund?{' '}
                  <span className="text-blue-600 underline">Go to Investor Portal →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
