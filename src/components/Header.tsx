import React from 'react';
import { Home, Briefcase, GraduationCap, ShieldCheck, Info, Search, User, LogOut } from 'lucide-react';

export type NavTab = 'home' | 'shop_jobs' | 'opportunities' | 'applications' | 'safety' | 'about';

export interface HeaderUser {
  name: string;
  email: string;
  role: 'jobseeker' | 'recruiter';
}

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  currentUser?: HeaderUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenAuth,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-18">
        {/* Left: Brand Logo & Text */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
        >
          <img
            src="/src/assets/images/logo_emblem.png"
            alt="OpportunityHub Emblem"
            className="h-9 w-auto object-contain"
          />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold tracking-tight">
                <span className="text-[#0B1A3D]">Opportunity</span>
                <span className="text-[#00875A]">Hub</span>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[9px] font-black tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </div>
            <span className="text-[9px] font-bold text-[#1E3A8A] tracking-[0.22em] mt-0.5">
              SOUTH AFRICA
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-neutral-700">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all relative ${
              activeTab === 'home'
                ? 'text-[#00674F] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
            {activeTab === 'home' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#00674F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('shop_jobs')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all relative ${
              activeTab === 'shop_jobs'
                ? 'text-[#E11D48] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="text-sm">🛍️</span>
            <span>Shop Jobs</span>
            {activeTab === 'shop_jobs' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#E11D48] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('opportunities')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all relative ${
              activeTab === 'opportunities'
                ? 'text-[#00674F] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>All Opportunities</span>
            {activeTab === 'opportunities' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#00674F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('applications')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all relative ${
              activeTab === 'applications'
                ? 'text-[#00674F] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Applications</span>
            {activeTab === 'applications' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#00674F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('safety')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all relative ${
              activeTab === 'safety'
                ? 'text-[#00674F] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safety Tips</span>
            {activeTab === 'safety' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#00674F] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('about')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all relative ${
              activeTab === 'about'
                ? 'text-[#00674F] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About</span>
            {activeTab === 'about' && (
              <span className="absolute bottom-[-17px] left-2 right-2 h-0.5 bg-[#00674F] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Search opportunities"
          >
            <Search className="w-4 h-4" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                  currentUser.role === 'recruiter' ? 'bg-[#0B1A3D]' : 'bg-[#00674F]'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-neutral-800 line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-neutral-500 capitalize mt-0.5">
                    {currentUser.role === 'recruiter' ? 'Verified Recruiter' : 'Jobseeker'}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00533F] rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
