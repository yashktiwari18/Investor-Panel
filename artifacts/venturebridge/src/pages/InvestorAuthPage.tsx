import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  HandCoins,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { loginUser, registerUser, validateNewPassword } from '../auth';

export interface InvestorAuthData {
  name: string;
  firmName: string;
  email: string;
  investorType?: string;
  ticketSize?: string;
}

interface InvestorAuthPageProps {
  onSuccess: (data: InvestorAuthData) => void;
  onBack: () => void;
  onSwitchToCreator: () => void;
  initialMode?: 'login' | 'signup';
}

export default function InvestorAuthPage({
  onSuccess,
  onBack,
  onSwitchToCreator,
  initialMode = 'login',
}: InvestorAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up fields (First Name, Last Name Optional, Personal/Business Email per Image 1)
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupInvestorType, setSignupInvestorType] = useState('Individual');
  const [signupWorkEmail, setSignupWorkEmail] = useState('');
  const [signupTicketSize, setSignupTicketSize] = useState('15-30');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupAccredited, setSignupAccredited] = useState(true);

  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Live password checklist evaluations
  const isMinLength = signupPassword.length >= 8;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(signupPassword);
  const isMatching =
    signupPassword.length > 0 &&
    signupConfirmPassword.length > 0 &&
    signupPassword === signupConfirmPassword;
  const allPasswordCriteriaMet = isMinLength && hasSpecialChar && isMatching;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    // Real Authentication Check against registered users
    const result = loginUser(loginEmail, loginPassword, 'investor');

    if (!result.success || !result.user) {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
      return;
    }

    // Authenticated successfully!
    onSuccess({
      name: result.user.name,
      firmName: result.user.firmName || result.user.name,
      email: result.user.email,
      investorType: result.user.investorType,
      ticketSize: result.user.ticketSize,
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    // First Name * (mandatory)
    if (!signupFirstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    // Personal / Business Email * (mandatory)
    if (!signupWorkEmail.trim()) {
      setError('Please enter your personal or business email address.');
      return;
    }

    // Validate password: 8 chars, 1 special char, matches confirm password
    const passValidation = validateNewPassword(signupPassword, signupConfirmPassword);
    if (!passValidation.isValid) {
      setError(passValidation.error || 'Invalid password.');
      return;
    }

    if (!signupAccredited) {
      setError('Kripya pushti karein ki details correct hain aur aap terms & conditions se sehmat hain.');
      return;
    }

    const fullName = `${signupFirstName.trim()} ${signupLastName.trim()}`.trim();

    // Register new investor account
    const result = registerUser({
      name: fullName,
      firmName: fullName,
      email: signupWorkEmail.trim(),
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
      role: 'investor',
      investorType: signupInvestorType,
      ticketSize: signupTicketSize,
    });

    if (!result.success || !result.user) {
      setError(result.error || 'Registration failed. Please try again.');
      return;
    }

    // Success! Direct them to log in with their created account
    setSuccessNotice(
      `🎉 Investor account registered successfully for ${result.user.name}! Please enter your password to log in.`
    );
    setLoginEmail(result.user.email);
    setLoginPassword('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setMode('login'); // Switch to login tab!
  };

  // Demo auto-fill helpers
  const handleDemoLogin = (email = 'deals@northstarvc.in', pass = 'Investor@123') => {
    setMode('login');
    setLoginEmail(email);
    setLoginPassword(pass);
    setError('');
    setSuccessNotice('Pre-filled sample investor credentials. Click "Log In" below.');
  };

  const handleDemoSignupFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSignupFirstName('Vikram');
    setSignupLastName('Singhania');
    setSignupWorkEmail(`vikram.investor${randomSuffix}@gmail.com`);
    setSignupInvestorType('Individual');
    setSignupTicketSize('15-30');
    setSignupPassword('Investor@123');
    setSignupConfirmPassword('Investor@123');
    setError('');
    setSuccessNotice('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e213b] via-[#122e53] to-[#0f2442] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0e213b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
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
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1a6ec9] to-[#3b82f6] text-white shadow-sm ring-1 ring-blue-400/30">
                <Building2 className="size-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Idea<span className="text-[#38bdf8]">Bridge</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-bold text-sky-300">
              <BadgeCheck className="size-3.5 text-sky-400" />
              <span>Accredited Investor Portal</span>
            </span>

            <button
              type="button"
              onClick={onSwitchToCreator}
              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <span>Creator Portal</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Investor Value Prop & Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/60 px-3.5 py-1 text-xs font-bold text-sky-300 shadow-sm">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Curated Collegiate Deal Flow</span>
            </div>

            <h1 className="font-[var(--app-font-serif)] text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl">
              Discover & Back Early-Stage Collegiate Breakouts
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              New capital partners must register first. Once your account is created, log in to browse curated campus inventions, review pitch summaries, signal syndicate interest, and access deal rooms.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-sky-400">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Pre-Screened Campus Inventions</h2>
                  <p className="text-[11px] text-slate-300">
                    Proprietary deal flow from leading technical universities with verified founder identities and IP ownership.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <HandCoins className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Non-Dilutive Grant Co-Investment</h2>
                  <p className="text-[11px] text-slate-300">
                    Syndicate angel checks alongside university-backed milestone grants from ₹2 Lakhs to ₹50 Lakhs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-sm backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Authenticated Deal Room Access</h2>
                  <p className="text-[11px] text-slate-300">
                    Passwords require at least 8 characters with a special character for institutional security.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs italic text-slate-300">
                “We found an innovative creator team with amazing potential through IdeaBridge. The clarity of milestones and campus endorsement made diligence 5x faster.”
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Ananya Sharma"
                  className="size-8 rounded-full object-cover ring-2 ring-sky-400/40"
                />
                <div>
                  <p className="text-xs font-bold text-white">Ananya Sharma</p>
                  <p className="text-[10px] text-slate-400">Partner, GrowthFund Insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Investor Auth Card */}
          <div className="lg:col-span-7">
            <div className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white text-slate-900 p-6 sm:p-8 shadow-2xl">
              {/* Card Header & Tab Switcher */}
              <div className="mb-6 space-y-4 text-center sm:text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {mode === 'login' ? 'INVESTOR LOG IN' : 'Step 1: Investor Registration'}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {mode === 'login' ? 'Step 2 of 2' : 'Step 1 of 2'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0f2d52]">
                  {mode === 'login' ? 'Log In to Investor Workspace' : 'Register as an Investor / Angel'}
                </h2>
                <p className="text-xs text-slate-500">
                  {mode === 'login'
                    ? 'Enter your personal or business email and password to access the investor deal flow workspace.'
                    : 'First register your investment profile. After registering, log in to explore curated creator projects.'}
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
                    Investor Log In
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
                    Register as Investor
                  </button>
                </div>
              </div>

              {/* Fast Testing / Demo Helper */}
              {mode === 'login' ? (
                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="size-4 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-800">Quick Test (Seeded):</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('deals@northstarvc.in', 'Investor@123')}
                        className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Northstar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('seed@cleanplanet.io', 'Investor@123')}
                        className="rounded-lg bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-emerald-800"
                      >
                        CleanPlanet
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Seeded accounts with password: <code className="rounded bg-white px-1 py-0.5 font-mono text-[10px]">Investor@123</code>
                  </p>
                </div>
              ) : (
                <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-4 text-sky-600" />
                      <span className="text-xs font-bold text-sky-900">1-Click New Investor Fill:</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoSignupFill}
                      className="rounded-lg bg-sky-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-sky-800"
                    >
                      Fill New Investor
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-sky-800">
                    Auto-fills a new unique investor with matching passwords to test registration.
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
                          setSignupWorkEmail(loginEmail);
                          setError('');
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-0.5 font-bold text-red-800 hover:bg-red-200"
                      >
                        <span>Register your investor account now</span>
                        <ArrowRight className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* INVESTOR LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Work / Personal or Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. deals@northstarvc.in"
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
                        onClick={() => alert('Password recovery link sent to your corporate address.')}
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
                      id="remember-investor"
                      defaultChecked
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-investor" className="text-xs text-slate-600">
                      Keep me logged in on this workstation
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f2d52] px-6 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition hover:bg-[#1a4477] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span>Log In to Investor Workspace</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="border-t border-slate-100 pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      Not registered as investor yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setError('');
                          setSuccessNotice('');
                        }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Register First
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* INVESTOR SIGNUP FORM (Image 1, 2, 3 changes) */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  {/* Row 1: First Name * & Last Name (Optional) */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          placeholder="e.g. Vikram"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Last Name
                        </label>
                        <span className="text-[10px] font-semibold text-slate-400">Optional</span>
                      </div>
                      <div className="relative mt-1.5">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          placeholder="e.g. Singhania"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Investor Classification (Individual 1st, Business firm 2nd) & Ticket Size */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Investor Classification
                      </label>
                      <select
                        value={signupInvestorType}
                        onChange={(e) => setSignupInvestorType(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {/* 1st: Individual Angel / Individual per Image 2 & 3 */}
                        <option value="Individual">Individual</option>
                        {/* 2nd: Business firm per Image 2 & 3 */}
                        <option value="Business firm">Business firm</option>
                        <option value="Angel Syndicate / Network">Angel Syndicate / Network</option>
                        <option value="Venture Capital Fund (VC)">Venture Capital Fund (VC)</option>
                        <option value="Campus Accelerator / Incubator">Campus Accelerator / Incubator</option>
                        <option value="Family Office">Family Office</option>
                        <option value="Corporate Venture (CVC)">Corporate Venture (CVC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Typical Ticket Size
                      </label>
                      <select
                        value={signupTicketSize}
                        onChange={(e) => setSignupTicketSize(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="2-5">₹ 2 - 5 Lakhs</option>
                        <option value="5-10">₹ 5 - 10 Lakhs</option>
                        <option value="10-15">₹ 10 - 15 Lakhs</option>
                        <option value="15-30">₹ 15 - 30 Lakhs</option>
                        <option value="30-50">₹ 30 - 50 Lakhs</option>
                        <option value="50+">₹ 50+ Lakhs</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Personal / Business Email * (Image 1) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Personal / Business Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={signupWorkEmail}
                        onChange={(e) => setSignupWorkEmail(e.target.value)}
                        placeholder="e.g. vikram@domain.com or deals@apex.in"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password Section */}
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
                            placeholder="Min. 8 chars (e.g. Fund@123)"
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

                    {/* Password Checklist Box */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="size-4 text-blue-600" />
                          <span>Check list Password</span>
                        </span>
                        {signupPassword.length > 0 && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              allPasswordCriteriaMet
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {allPasswordCriteriaMet ? 'All Met ✓' : 'Requirements Pending'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div
                          className={`flex items-center gap-2 transition-colors ${
                            isMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          {isMinLength ? (
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="size-4 rounded border border-slate-300 bg-white shrink-0" />
                          )}
                          <span>At least 8 characters long ({signupPassword.length}/8)</span>
                        </div>

                        <div
                          className={`flex items-center gap-2 transition-colors ${
                            hasSpecialChar ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          {hasSpecialChar ? (
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="size-4 rounded border border-slate-300 bg-white shrink-0" />
                          )}
                          <span>At least 1 special character (!@#$%^&* etc.)</span>
                        </div>

                        <div
                          className={`flex items-center gap-2 transition-colors ${
                            isMatching ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                          }`}
                        >
                          {isMatching ? (
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="size-4 rounded border border-slate-300 bg-white shrink-0" />
                          )}
                          <span>Confirm password matches Create password</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox (Exact text requested in Image 1) */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="investor-terms"
                      checked={signupAccredited}
                      onChange={(e) => setSignupAccredited(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="investor-terms" className="text-[11px] leading-tight text-slate-600">
                      Aapke dwara di gai details correct hai, aap hmare terms & condition, data policy se aap sehmat hai.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f2d52] px-6 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition hover:bg-[#1a4477] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span>Register Account as Investor</span>
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
                        Sign in to account
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Bottom Switch to Creator (Image 1: replace student or campus innovator to creator) */}
              <div className="mt-5 border-t border-slate-100 pt-3.5 text-center">
                <button
                  type="button"
                  onClick={onSwitchToCreator}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition"
                >
                  Are you a creator looking to list?{' '}
                  <span className="text-blue-600 underline">Go to Creator Portal →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
