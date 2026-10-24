import React, { useState, useEffect, useId } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  FileCheck2,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  HelpCircle,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

export type UserRole = 'jobseeker' | 'recruiter';

export interface AuthUserData {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  province?: string;
  idNumber?: string;
  companyName?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (userData: AuthUserData) => void;
}

const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
];

const EDUCATION_LEVELS = [
  'Grade 10 or Below',
  'Grade 11',
  'Matric (Grade 12 / NSC)',
  'TVET / Nated Certificate',
  'National Diploma',
  'Bachelor’s Degree',
  'Postgraduate / Honours / Masters',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
}) => {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(mode);
  const [role, setRole] = useState<UserRole>('jobseeker');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [idType, setIdType] = useState<'said' | 'passport'>('said');
  const [idNumber, setIdNumber] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [education, setEducation] = useState('Matric (Grade 12 / NSC)');
  const [companyName, setCompanyName] = useState('');
  const [acceptPopia, setAcceptPopia] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Sync mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
    setIsForgotPassword(false);
    setResetSent(false);
    setErrorMsg('');
  }, [mode, isOpen]);

  // Password Strength Calculation
  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: 'Empty', color: 'bg-neutral-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-600' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-600' };
  }, [password]);

  if (!isOpen) return null;

  // Handle Quick Demo profiles
  const handleQuickDemo = (demoType: 'candidate' | 'recruiter') => {
    setErrorMsg('');
    if (demoType === 'candidate') {
      setName('Thabo Mokoena');
      setEmail('thabo.mokoena@workmail.co.za');
      setPhone('072 555 4912');
      setPassword('Jobseeker@2025!');
      setRole('jobseeker');
      setProvince('Gauteng');
      setEducation('Matric (Grade 12 / NSC)');
      setIdNumber('980415 5021 08 4');
    } else {
      setName('Shoprite Talent Acquisition');
      setEmail('recruitment@shoprite.co.za');
      setPhone('021 980 4000');
      setPassword('ShopriteRecruit#2025');
      setRole('recruiter');
      setCompanyName('Shoprite Checkers Group SA');
      setProvince('Western Cape');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (currentMode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full official name.');
      return;
    }

    if (currentMode === 'signup' && !acceptPopia) {
      setErrorMsg('Please accept the POPIA data protection terms to proceed.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    // Simulate authentic network authentication
    setTimeout(() => {
      setIsLoading(false);
      const userData: AuthUserData = {
        name: name || (email.split('@')[0].replace('.', ' ') || 'Registered User'),
        email: email.trim().toLowerCase(),
        role: role,
        phone: phone || undefined,
        province: province,
        idNumber: idNumber || undefined,
        companyName: role === 'recruiter' ? companyName || 'Verified Employer' : undefined,
      };

      onSuccess(userData);
      onClose();
    }, 700);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row border border-neutral-200 overflow-hidden my-auto max-h-[92vh]">
        {/* Left Institutional Branding & Trust Column (Desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-[#0B1A3D] text-white p-7 flex-col justify-between relative overflow-hidden shrink-0">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-[#00674F] rounded-full blur-3xl opacity-30" />

          {/* Brand header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-5">
              <img
                src="/src/assets/images/logo_emblem.png"
                alt="OpportunityHub South Africa"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-black tracking-tight text-white">
                    Opportunity<span className="text-[#34D399]">Hub</span>
                  </span>
                </div>
                <span className="text-[9px] font-bold text-neutral-300 tracking-[0.25em] block mt-0.5">
                  REPUBLIC OF SOUTH AFRICA
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Employment Gateway
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {currentMode === 'login'
                  ? 'Access Verified South African Opportunities.'
                  : 'Start Your Verified Career Journey Today.'}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Connect directly with genuine supermarket, public sector, and corporate vacancies across all 9 provinces.
              </p>
            </div>

            {/* Institutional Guarantees */}
            <div className="mt-6 space-y-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[11px]">POPIA Act Protected</h4>
                  <p className="text-[10px] text-neutral-300">
                    Your personal information and ID data are encrypted and never sold.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[11px]">Strict Zero-Fee Policy</h4>
                  <p className="text-[10px] text-neutral-300">
                    Compliant with SA Employment Services Act 4 of 2014. Free for candidates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[11px]">Z83 & Direct Portal Sync</h4>
                  <p className="text-[10px] text-neutral-300">
                    Auto-generate verified government forms and track status in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Footer */}
          <div className="relative z-10 pt-5 mt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Quick Demo Profiles
              </span>
              <span className="text-[9px] text-neutral-400">1-click test</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('candidate')}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-left transition-colors border border-white/10 cursor-pointer"
              >
                <span className="font-bold block text-emerald-300">Jobseeker Demo</span>
                <span className="text-[9px] text-neutral-300 truncate block">Thabo M. (Gauteng)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-left transition-colors border border-white/10 cursor-pointer"
              >
                <span className="font-bold block text-blue-300">Recruiter Demo</span>
                <span className="text-[9px] text-neutral-300 truncate block">Shoprite HR Talent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          {/* Top Bar with Mode Tabs and Close Button */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-1 bg-neutral-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCurrentMode('login');
                  setIsForgotPassword(false);
                  setErrorMsg('');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'login' && !isForgotPassword
                    ? 'bg-white text-[#0B1A3D] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentMode('signup');
                  setIsForgotPassword(false);
                  setErrorMsg('');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'signup' && !isForgotPassword
                    ? 'bg-[#00674F] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Close authentication modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-7 flex-1">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Forgot Password Flow */}
            {isForgotPassword ? (
              <div className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-base font-bold text-neutral-900">Reset Your Password</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Enter the email address or South African mobile number associated with your account.
                  </p>
                </div>

                {resetSent ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Recovery Link Dispatched
                    </div>
                    <p className="text-xs text-neutral-600">
                      We have sent password reset instructions and a verification code to <strong>{email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetSent(false);
                        setCurrentMode('login');
                      }}
                      className="w-full py-2 bg-[#00674F] text-white font-bold text-xs rounded-lg hover:bg-[#00533F] transition-colors cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. thabo@example.co.za"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-[#00674F] hover:bg-[#00503D] disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <span>Sending Instructions...</span>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Send Password Reset Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 font-medium py-1"
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* Standard Log In / Sign Up Form */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Account Type Selector for Sign Up */}
                {currentMode === 'signup' && (
                  <div className="mb-4">
                    <label className="block font-semibold text-neutral-700 mb-1.5 text-xs">
                      I want to register as:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('jobseeker')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          role === 'jobseeker'
                            ? 'border-[#00674F] bg-emerald-50/50 text-[#00674F] ring-1 ring-[#00674F]'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <User className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-bold text-xs">Jobseeker</div>
                          <div className="text-[10px] text-neutral-500">Applicant / Youth</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('recruiter')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          role === 'recruiter'
                            ? 'border-[#0B1A3D] bg-blue-50/50 text-[#0B1A3D] ring-1 ring-[#0B1A3D]'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-bold text-xs">Employer / Recruiter</div>
                          <div className="text-[10px] text-neutral-500">Retailer / Public HR</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Recruiter Company Name */}
                {currentMode === 'signup' && role === 'recruiter' && (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Organization / Company Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shoprite Checkers, Pick n Pay, City of Cape Town"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                      />
                    </div>
                  </div>
                )}

                {/* Full Name for Sign Up */}
                {currentMode === 'signup' && (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      {role === 'recruiter' ? 'HR Contact Person Name' : 'Full Name (as per SA ID)'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder={role === 'recruiter' ? 'e.g. Amanda Sithole' : 'e.g. Thabo Mokoena'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={role === 'recruiter' ? 'talent@company.co.za' : 'yourname@example.co.za'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                    />
                  </div>
                </div>

                {/* Mobile Number for Sign Up */}
                {currentMode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Mobile / WhatsApp (SA)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="e.g. 072 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Province
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                      >
                        {SA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Education / ID for Candidate Sign Up */}
                {currentMode === 'signup' && role === 'jobseeker' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Highest Qualification
                      </label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                      >
                        {EDUCATION_LEVELS.map((edu) => (
                          <option key={edu} value={edu}>
                            {edu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        SA ID Number <span className="text-[10px] text-neutral-400">(Optional for Z83)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={13}
                        placeholder="13-digit ID number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F] font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-neutral-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    {currentMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[11px] font-semibold text-[#00674F] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00674F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter (in Signup) */}
                  {currentMode === 'signup' && password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-500">Security strength:</span>
                        <span className="font-semibold text-neutral-700">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkboxes: Remember Me (Login) / POPIA Consent (Signup) */}
                {currentMode === 'login' ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-neutral-300 text-[#00674F] focus:ring-[#00674F]"
                      />
                      <span className="text-neutral-600 text-[11px]">Remember this trusted device</span>
                    </label>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      TLS 256-bit Secure
                    </span>
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptPopia}
                        onChange={(e) => setAcceptPopia(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 text-[#00674F] focus:ring-[#00674F]"
                      />
                      <span className="text-neutral-600 text-[11px] leading-tight">
                        I consent to the processing of my information under the South African{' '}
                        <strong className="text-neutral-800">POPIA Act</strong> for legitimate employment matching and verified recruitment communications.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#00674F] hover:bg-[#00503D] disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        {currentMode === 'login' ? 'Authenticating...' : 'Creating Verified Profile...'}
                      </span>
                    ) : (
                      <>
                        <span>{currentMode === 'login' ? 'Sign In to OpportunityHub' : 'Create Free Account'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Quick Demo Switcher (Visible on small screens where left sidebar is hidden) */}
                <div className="md:hidden pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-medium">Quick Demo Test:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('candidate')}
                      className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[#00674F] font-bold text-[10px]"
                    >
                      Thabo (Jobseeker)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('recruiter')}
                      className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[#0B1A3D] font-bold text-[10px]"
                    >
                      Shoprite HR
                    </button>
                  </div>
                </div>

                {/* Bottom Toggle */}
                <div className="pt-2 text-center text-neutral-500 text-xs">
                  {currentMode === 'login' ? (
                    <span>
                      Don't have an OpportunityHub account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentMode('signup');
                          setErrorMsg('');
                        }}
                        className="font-bold text-[#00674F] hover:underline cursor-pointer ml-1"
                      >
                        Create Free Account
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have a verified account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentMode('login');
                          setErrorMsg('');
                        }}
                        className="font-bold text-[#00674F] hover:underline cursor-pointer ml-1"
                      >
                        Sign In Here
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
