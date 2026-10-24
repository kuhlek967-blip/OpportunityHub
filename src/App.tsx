import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Opportunity, MonitoredFeed, SyncLogEvent, OpportunityType } from './types';
import {
  INITIAL_OPPORTUNITIES,
  INITIAL_MONITORED_FEEDS,
  INITIAL_SYNC_LOGS,
  UPCOMING_LEGIT_FEED_POOL,
  generateRealTimeLegitJob,
} from './data/mockOpportunities';
import { getClosingDateStatus } from './utils/integrityEngine';
import { Header, NavTab } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ValuePropositionStrip } from './components/ValuePropositionStrip';
import { OpportunityCard } from './components/OpportunityCard';
import { RealTimeFeedBar } from './components/RealTimeFeedBar';
import { RightSidebar } from './components/RightSidebar';
import { OpportunityFilterBar } from './components/OpportunityFilterBar';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { Z83AssistantModal } from './components/Z83AssistantModal';
import { ScamSandboxModal } from './components/ScamSandboxModal';
import { FeedMonitorModal } from './components/FeedMonitorModal';
import { CVBuilderModal } from './components/CVBuilderModal';
import { ApplicationTrackerModal, TrackedApplication } from './components/ApplicationTrackerModal';
import { JobAlertsModal } from './components/JobAlertsModal';
import { AuthModal, AuthUserData } from './components/AuthModal';
import { Footer } from './components/Footer';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Info,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Opportunities & Feeds State (v4 for full supermarket and automatic sync coverage)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('opphub_opportunities_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_OPPORTUNITIES;
      }
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [feeds, setFeeds] = useState<MonitoredFeed[]>(() => {
    const saved = localStorage.getItem('opphub_feeds_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MONITORED_FEEDS;
      }
    }
    return INITIAL_MONITORED_FEEDS;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLogEvent[]>(() => {
    const saved = localStorage.getItem('opphub_logs_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SYNC_LOGS;
      }
    }
    return INITIAL_SYNC_LOGS;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('opphub_bookmarks_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['opp-capitec-dev-001'];
      }
    }
    return ['opp-capitec-dev-001'];
  });

  // Tracked Applications State
  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem('opphub_applications_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [
          {
            id: 'app-01',
            title: 'Graduate Software Developer',
            organization: 'Capitec Bank',
            referenceNo: 'CAP-TECH-2026-88',
            status: 'Applied',
            deadline: '2026-11-30',
            appliedDate: '2026-10-22',
            notes: 'Submitted portfolio on Capitec Careers portal.',
          },
          {
            id: 'app-02',
            title: 'Registry Clerk: Human Resources',
            organization: 'DPSA National Office',
            referenceNo: 'DPSA/2026/CIRC-38-04',
            status: 'Z83 Prepared',
            deadline: '2026-11-06',
            appliedDate: '2026-10-24',
            notes: 'Completed New Z83 form, waiting for hand delivery.',
          },
        ];
      }
    }
    return [
      {
        id: 'app-01',
        title: 'Graduate Software Developer',
        organization: 'Capitec Bank',
        referenceNo: 'CAP-TECH-2026-88',
        status: 'Applied',
        deadline: '2026-11-30',
        appliedDate: '2026-10-22',
        notes: 'Submitted portfolio on Capitec Careers portal.',
      },
      {
        id: 'app-02',
        title: 'Registry Clerk: Human Resources',
        organization: 'DPSA National Office',
        referenceNo: 'DPSA/2026/CIRC-38-04',
        status: 'Z83 Prepared',
        deadline: '2026-11-06',
        appliedDate: '2026-10-24',
        notes: 'Completed New Z83 form, waiting for hand delivery.',
      },
    ];
  });

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    province: 'all',
    opportunityType: 'all',
    qualification: 'all',
    urgency: 'all',
    showScams: false,
    onlyBookmarked: false,
  });

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [z83ModalOpen, setZ83ModalOpen] = useState(false);
  const [activeZ83Opportunity, setActiveZ83Opportunity] = useState<Opportunity | null>(null);
  const [scamSandboxOpen, setScamSandboxOpen] = useState(false);
  const [feedMonitorOpen, setFeedMonitorOpen] = useState(false);
  const [cvBuilderOpen, setCvBuilderOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [jobAlertsOpen, setJobAlertsOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });

  const [currentUser, setCurrentUser] = useState<AuthUserData | null>(() => {
    const saved = localStorage.getItem('opphub_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('opphub_opportunities_v4', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('opphub_feeds_v4', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem('opphub_logs_v2', JSON.stringify(syncLogs));
  }, [syncLogs]);

  useEffect(() => {
    localStorage.setItem('opphub_bookmarks_v2', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('opphub_applications_v2', JSON.stringify(applications));
  }, [applications]);

  // URL query param check (e.g. ?opp=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oppId = params.get('opp');
    if (oppId) {
      const match = opportunities.find((o) => o.id === oppId);
      if (match) {
        setSelectedOpportunity(match);
        setDetailModalOpen(true);
      }
    }
  }, [opportunities]);

  // Bookmark handler
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved opportunities');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your bookmarks');
        return [...prev, id];
      }
    });
  };

  // Select opportunity
  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setDetailModalOpen(true);
  };

  // Open Z83
  const handleOpenZ83 = (opp?: Opportunity | null) => {
    setActiveZ83Opportunity(opp || selectedOpportunity || null);
    setZ83ModalOpen(true);
  };

  // Report Listing
  const handleReportListing = (opp: Opportunity) => {
    setOpportunities((prev) =>
      prev.map((item) => {
        if (item.id === opp.id) {
          return {
            ...item,
            scamAssessment: {
              ...item.scamAssessment,
              riskLevel: 'under_review',
              scamWarningNotes: 'User flagged for manual HR compliance review.',
            },
          };
        }
        return item;
      })
    );
    showToast(`Listing ${opp.referenceNumber} flagged for review`);
  };

  // Real-Time Live Feed Engine State
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [syncInterval, setSyncInterval] = useState<number>(15); // 15 seconds real-time cycle
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number>(15);
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [justStreamedJobIds, setJustStreamedJobIds] = useState<string[]>([]);
  const [latestIngestedJob, setLatestIngestedJob] = useState<Opportunity | null>(null);
  const [floatingLiveBanner, setFloatingLiveBanner] = useState<Opportunity | null>(null);

  const upcomingQueueRef = useRef<Opportunity[]>([...UPCOMING_LEGIT_FEED_POOL]);

  // Gentle synth chime for newly streamed legitimate opportunities
  const playLiveChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Real-Time 1-second countdown ticker
  useEffect(() => {
    if (isStreamPaused) return;

    const timer = setInterval(() => {
      setSecondsUntilNextSync((prev) => {
        if (prev <= 1) {
          handleTriggerSync(false);
          return syncInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStreamPaused, syncInterval]);

  // Real-Time Feed Ingest Trigger (Automatic stream or manual pulse)
  const handleTriggerSync = async (isManual = true): Promise<void> => {
    setIsAutoSyncing(true);
    const nowTime = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

    let incomingOpp: Opportunity;
    if (upcomingQueueRef.current.length > 0) {
      incomingOpp = upcomingQueueRef.current.shift()!;
    } else {
      incomingOpp = generateRealTimeLegitJob();
    }

    // Prepend to top of opportunities and avoid duplicates
    setOpportunities((prev) => [incomingOpp, ...prev.filter((o) => o.id !== incomingOpp.id)]);
    setLatestIngestedJob(incomingOpp);
    setFloatingLiveBanner(incomingOpp);

    // Track recently arrived job IDs for glow badge
    setJustStreamedJobIds((prev) => [incomingOpp.id, ...prev.slice(0, 9)]);

    // Play optional gentle chime
    if (soundEnabled) {
      playLiveChime();
    }

    // Update monitored feed stats
    setFeeds((prev) =>
      prev.map((f) => ({
        ...f,
        lastChecked: `Live at ${nowTime} SAST`,
        totalIngested: f.totalIngested + 1,
      }))
    );

    // Add log entry
    const newLog: SyncLogEvent = {
      id: `log-${Date.now()}`,
      timestamp: `2026-10-24 ${nowTime} SAST`,
      feedName: incomingOpp.source.name || 'Verified Real-Time Ingest',
      action: 'ingested',
      details: `Live Real-Time Stream: Ingested verified vacancy "${incomingOpp.title}" at ${incomingOpp.organization} (0 fees verified).`,
      status: 'success',
    };

    setSyncLogs((prev) => [newLog, ...prev]);
    setLastSyncTime(`Today at ${nowTime}`);

    setTimeout(() => {
      setIsAutoSyncing(false);
      setSecondsUntilNextSync(syncInterval);
      if (isManual) {
        showToast(`⚡ Streamed live: "${incomingOpp.title}" at ${incomingOpp.organization}`);
      }
    }, 450);
  };

  const handleAddFeed = (newFeedData: Omit<MonitoredFeed, 'id' | 'totalIngested' | 'duplicatesBlocked' | 'scamsQuarantined' | 'status'>) => {
    const newFeed: MonitoredFeed = {
      ...newFeedData,
      id: `feed-custom-${Date.now()}`,
      totalIngested: 1,
      duplicatesBlocked: 0,
      scamsQuarantined: 0,
      status: 'active',
    };
    setFeeds((prev) => [newFeed, ...prev]);
    showToast(`Source "${newFeed.name}" registered for automated polling`);
  };

  // Application Tracker actions
  const handleUpdateApplicationStatus = (id: string, status: TrackedApplication['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Status updated to "${status}"`);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application removed from tracker');
  };

  const handleAddApplication = (appData: Omit<TrackedApplication, 'id'>) => {
    const newApp: TrackedApplication = {
      ...appData,
      id: `app-${Date.now()}`,
    };
    setApplications((prev) => [newApp, ...prev]);
    showToast('Application added to your tracker');
  };

  // Search execution from hero
  const handleExecuteHeroSearch = () => {
    setActiveTab('opportunities');
  };

  // Quick category select
  const handleSelectCategory = (type: OpportunityType | 'all') => {
    setFilters((prev) => ({ ...prev, opportunityType: type }));
    setActiveTab('opportunities');
  };

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (!filters.showScams && opp.scamAssessment.riskLevel === 'flagged_scam') {
        return false;
      }
      if (filters.onlyBookmarked && !bookmarks.includes(opp.id)) {
        return false;
      }
      if (filters.province !== 'all' && opp.province !== filters.province) {
        return false;
      }
      if (filters.opportunityType !== 'all' && opp.opportunityType !== filters.opportunityType) {
        return false;
      }
      if (filters.qualification !== 'all' && opp.qualification !== filters.qualification) {
        return false;
      }
      if (filters.urgency !== 'all') {
        const closing = getClosingDateStatus(opp.closingDate);
        if (filters.urgency === '3_days' && (closing.daysLeft > 3 || closing.daysLeft < 0)) return false;
        if (filters.urgency === '14_days' && (closing.daysLeft > 14 || closing.daysLeft < 0)) return false;
        if (filters.urgency === 'this_month' && closing.daysLeft < 0) return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organization.toLowerCase().includes(q);
        const matchRef = opp.referenceNumber.toLowerCase().includes(q);
        const matchCity = opp.city.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchRef && !matchCity) return false;
      }
      return true;
    });
  }, [opportunities, filters, bookmarks]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-neutral-700 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('opphub_user_v1');
          showToast('Signed out of OpportunityHub.');
        }}
        onSelectTab={(tab) => {
          if (tab === 'shop_jobs') {
            setFilters((prev) => ({ ...prev, opportunityType: 'shop_job', search: '' }));
            setActiveTab('opportunities');
            showToast('Showing verified Supermarket & Shop Recruitments');
          } else {
            if (tab === 'opportunities') {
              setFilters((prev) => ({ ...prev, opportunityType: 'all' }));
            }
            setActiveTab(tab);
          }
        }}
        onOpenSearch={() => {
          setActiveTab('opportunities');
        }}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* VIEW: HOME (Exact match to User's Uploaded Design) */}
      {activeTab === 'home' && (
        <div className="flex-1">
          {/* Hero Section */}
          <HeroSection
            searchQuery={filters.search}
            selectedLocation={filters.province}
            selectedQualification={filters.qualification}
            onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
            onLocationChange={(loc) => setFilters((prev) => ({ ...prev, province: loc }))}
            onQualificationChange={(qual) => setFilters((prev) => ({ ...prev, qualification: qual }))}
            onExecuteSearch={handleExecuteHeroSearch}
            onSelectCategory={handleSelectCategory}
          />

          {/* 4-Feature Value Strip */}
          <ValuePropositionStrip
            onLearnSafety={() => setScamSandboxOpen(true)}
            onOpenTracker={() => setTrackerModalOpen(true)}
            onOpenFilters={() => setActiveTab('opportunities')}
          />

          {/* Featured Opportunities Section with Right Sidebar */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Real-Time Live Feed Bar & Live Stream Ticker */}
            <RealTimeFeedBar
              totalLegitCount={filteredOpportunities.filter((o) => o.scamAssessment.riskLevel !== 'flagged_scam').length}
              totalIngestedCount={feeds.reduce((acc, f) => acc + f.totalIngested, 0)}
              isAutoSyncing={isAutoSyncing}
              secondsUntilNextSync={secondsUntilNextSync}
              syncInterval={syncInterval}
              isStreamPaused={isStreamPaused}
              soundEnabled={soundEnabled}
              latestIngestedJob={latestIngestedJob}
              onTogglePause={() => {
                setIsStreamPaused((prev) => !prev);
                showToast(isStreamPaused ? 'Resumed live real-time stream' : 'Paused real-time stream');
              }}
              onToggleSound={() => {
                setSoundEnabled((prev) => !prev);
                showToast(soundEnabled ? 'Live sound chime muted' : 'Live sound chime enabled');
              }}
              onChangeInterval={(sec) => {
                setSyncInterval(sec);
                setSecondsUntilNextSync(sec);
                showToast(`Live feed interval set to ${sec}s`);
              }}
              onTriggerSyncNow={() => handleTriggerSync(true)}
              onViewJob={handleSelectOpportunity}
            />

            {/* Quick Supermarket & Shop Recruiter Strip */}
            <div className="mb-6 p-4 bg-white rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFE4E6] text-[#BE123C] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Active Supermarket & Shop Recruitments
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Direct hiring for till operators, cashiers, packers & store assistants
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { name: 'Shoprite & Checkers', query: 'Shoprite' },
                  { name: 'Woolworths', query: 'Woolworths' },
                  { name: 'Pick n Pay', query: 'Pick n Pay' },
                  { name: 'SPAR', query: 'SPAR' },
                  { name: 'Boxer Superstores', query: 'Boxer' },
                  { name: 'Mr Price', query: 'Mr Price' },
                  { name: 'Clicks', query: 'Clicks' },
                  { name: 'PEP Stores', query: 'PEP' },
                ].map((store) => (
                  <button
                    key={store.name}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, search: store.query, opportunityType: 'shop_job' }));
                      setActiveTab('opportunities');
                      showToast(`Filtered for ${store.name} vacancies`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px] transition-colors"
                  >
                    {store.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, opportunityType: 'shop_job', search: '' }));
                    setActiveTab('opportunities');
                    showToast('Viewing all verified shop recruitments');
                  }}
                  className="px-3 py-1 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-[11px] transition-colors shadow-xs"
                >
                  All Shop Jobs →
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Live Feed Automated Sync Active
                  </span>
                  <span className="text-xs text-neutral-300">·</span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Auto-displaying 100% verified legit jobs ({lastSyncTime})
                  </span>
                  <button
                    onClick={() => handleTriggerSync(true)}
                    disabled={isAutoSyncing}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50 ml-1"
                    title="Check official employer and government vacancy feeds now"
                  >
                    <RefreshCw className={`w-3 h-3 text-emerald-600 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                    <span>{isAutoSyncing ? 'Checking Feeds...' : 'Sync Now'}</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1.5">
                  All Verified Legitimate Opportunities ({filteredOpportunities.filter(o => o.scamAssessment.riskLevel !== 'flagged_scam').length})
                </h2>
              </div>

              {/* Fast Filter Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, opportunityType: 'all', search: '' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    filters.opportunityType === 'all' && !filters.search
                      ? 'bg-[#00674F] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  All ({filteredOpportunities.filter(o => o.scamAssessment.riskLevel !== 'flagged_scam').length})
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, opportunityType: 'shop_job', search: '' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    filters.opportunityType === 'shop_job'
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  🛍️ Shop Jobs ({opportunities.filter(o => o.opportunityType === 'shop_job').length})
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, opportunityType: 'government_circular', search: '' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    filters.opportunityType === 'government_circular'
                      ? 'bg-[#0077D8] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Gov (DPSA) ({opportunities.filter(o => o.opportunityType === 'government_circular').length})
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, opportunityType: 'learnership', search: '' }))}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    filters.opportunityType === 'learnership'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Learnerships ({opportunities.filter(o => o.opportunityType === 'learnership').length})
                </button>
              </div>
            </div>

            {/* Split Grid: All Legit Opportunities Grid on left, Quick Tools on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: All Legit Cards Grid */}
              <div className="lg:col-span-9">
                {filteredOpportunities.filter(o => o.scamAssessment.riskLevel !== 'flagged_scam').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOpportunities
                      .filter(o => o.scamAssessment.riskLevel !== 'flagged_scam')
                      .map((opp) => (
                        <OpportunityCard
                          key={opp.id}
                          opportunity={opp}
                          onSelect={handleSelectOpportunity}
                          isJustStreamed={justStreamedJobIds.includes(opp.id)}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-neutral-800">
                      No matching verified opportunities found
                    </div>
                    <p className="text-xs text-neutral-500">
                      Try clearing your search or location filter to see all legitimate vacancies.
                    </p>
                    <button
                      onClick={() => setFilters({
                        search: '',
                        province: 'all',
                        opportunityType: 'all',
                        qualification: 'all',
                        urgency: 'all',
                        showScams: false,
                        onlyBookmarked: false,
                      })}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00503D] rounded-lg transition-colors"
                    >
                      Show All Legit Jobs
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Quick Tools & Scam Box */}
              <div className="lg:col-span-3">
                <RightSidebar
                  onOpenCVBuilder={() => setCvBuilderOpen(true)}
                  onOpenTracker={() => setTrackerModalOpen(true)}
                  onOpenAlerts={() => setJobAlertsOpen(true)}
                  onFindNearMe={() => {
                    setFilters((prev) => ({ ...prev, province: 'Gauteng' }));
                    setActiveTab('opportunities');
                    showToast('Filtered for Gauteng regional opportunities');
                  }}
                  onLearnSafety={() => setScamSandboxOpen(true)}
                  onFilterShopJobs={() => {
                    setFilters((prev) => ({ ...prev, opportunityType: 'shop_job', search: '' }));
                    setActiveTab('opportunities');
                    showToast('Showing verified Supermarket & Shop Recruitments');
                  }}
                />
              </div>
            </div>

            {/* Live Feed Automations Trigger Strip */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EBF5FB] text-[#0077D8] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    Automated Feed Integrations ({feeds.length} Active Feeds)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    DPSA National Gazette · Western Cape E-Recruitment · YES4Youth API · SETA Clearing House
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenZ83(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#00674F] bg-[#E8F5F1] hover:bg-[#D5EFE7] rounded-lg transition-colors"
                >
                  New Z83 Guide
                </button>
                <button
                  onClick={() => setFeedMonitorOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00533F] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Feed Monitor & Sync</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW: OPPORTUNITIES (Full Search Directory with Filters) */}
      {activeTab === 'opportunities' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                All Verified Opportunities
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Government circulars, learnerships, internships, and bursaries across all 9 provinces
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenZ83(null)}
                className="px-3 py-1.5 text-xs font-semibold text-[#00674F] bg-[#E8F5F1] hover:bg-[#D5EFE7] rounded-lg transition-colors"
              >
                New Z83 Helper
              </button>
              <button
                onClick={() => setScamSandboxOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-300 transition-colors"
              >
                Check a Suspicious Ad
              </button>
            </div>
          </div>

          {/* Real-Time Live Stream Bar */}
          <RealTimeFeedBar
            totalLegitCount={filteredOpportunities.filter((o) => o.scamAssessment.riskLevel !== 'flagged_scam').length}
            totalIngestedCount={feeds.reduce((acc, f) => acc + f.totalIngested, 0)}
            isAutoSyncing={isAutoSyncing}
            secondsUntilNextSync={secondsUntilNextSync}
            syncInterval={syncInterval}
            isStreamPaused={isStreamPaused}
            soundEnabled={soundEnabled}
            latestIngestedJob={latestIngestedJob}
            onTogglePause={() => {
              setIsStreamPaused((prev) => !prev);
              showToast(isStreamPaused ? 'Resumed live real-time stream' : 'Paused real-time stream');
            }}
            onToggleSound={() => {
              setSoundEnabled((prev) => !prev);
              showToast(soundEnabled ? 'Live sound chime muted' : 'Live sound chime enabled');
            }}
            onChangeInterval={(sec) => {
              setSyncInterval(sec);
              setSecondsUntilNextSync(sec);
              showToast(`Live feed interval set to ${sec}s`);
            }}
            onTriggerSyncNow={() => handleTriggerSync(true)}
            onViewJob={handleSelectOpportunity}
          />

          <OpportunityFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={() =>
              setFilters({
                search: '',
                province: 'all',
                opportunityType: 'all',
                qualification: 'all',
                urgency: 'all',
                showScams: false,
                onlyBookmarked: false,
              })
            }
            totalCount={opportunities.length}
            filteredCount={filteredOpportunities.length}
            bookmarkedCount={bookmarks.length}
            quarantinedCount={
              opportunities.filter((o) => o.scamAssessment.riskLevel === 'flagged_scam').length
            }
          />

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onSelect={handleSelectOpportunity}
                  isJustStreamed={justStreamedJobIds.includes(opp.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-neutral-200 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-neutral-800">
                No matching verified opportunities found
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try broadening your province, education level, or clearing search keywords.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    province: 'all',
                    opportunityType: 'all',
                    qualification: 'all',
                    urgency: 'all',
                    showScams: false,
                    onlyBookmarked: false,
                  })
                }
                className="px-4 py-2 text-xs font-semibold text-[#00674F] bg-[#E8F5F1] hover:bg-[#D5EFE7] rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      )}

      {/* VIEW: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                My Application Tracker
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Track your submitted job, learnership, and bursary applications in one place
              </p>
            </div>
            <button
              onClick={() => setTrackerModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00503D] rounded-lg transition-colors shadow-xs"
            >
              Manage & Add Applications
            </button>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3">Closing Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{app.title}</div>
                      <div className="text-neutral-500 text-[11px]">{app.organization}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-700">{app.referenceNo}</td>
                    <td className="py-3 px-3 font-mono text-neutral-600">{app.deadline}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-500 italic">{app.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* VIEW: SAFETY TIPS */}
      {activeTab === 'safety' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                Stay Safe: South African Job Scam Prevention
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Crucial safety rules to protect yourself from fake adverts, payment requests, and identity fraud
              </p>
            </div>
            <button
              onClick={() => setScamSandboxOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00503D] rounded-lg transition-colors shadow-xs"
            >
              Test an Advert in Scam Checker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Never Pay for a Job</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                In South Africa, the Basic Conditions of Employment Act makes it illegal for employers to charge candidates application, uniform, medical clearance, or registration fees. Any mention of Pep Pax, Mukuru, or eWallet is a guaranteed scam.
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Check Email Domains</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Government departments (DPSA, SAPS, Dept of Health) only use official <code>@department.gov.za</code> email addresses. Official public vacancies will never use generic <code>@gmail.com</code> or <code>@yahoo.com</code>.
              </p>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Protect Your Identity (POPIA)</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Under the revised DPSA directive (Circular 19 of 2022), applicants do NOT need to submit certified copies of qualifications or bank account details upfront. Only uncertified copies and your CV are required initially.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: ABOUT */}
      {activeTab === 'about' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              About OpportunityHub South Africa
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              OpportunityHub South Africa was created to address the pervasive challenge of youth unemployment and fake recruitment scams. By connecting directly to official government gazettes, SETA accreditation bodies, and verified employers, we provide a trusted single source for legitimate career pathways.
            </p>
            <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2 text-xs text-neutral-700">
              <div className="font-bold text-neutral-900">Our 4 Core Commitments:</div>
              <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                <li>Automated ingestion from verified government circulars and SETAs.</li>
                <li>Comprehensive heuristic scam scanning and duplicate elimination.</li>
                <li>Targeted search across all 9 provinces with Z83 application guidance.</li>
                <li>Automated polling updates to keep closing dates and vacancies fresh.</li>
              </ul>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Modals */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isBookmarked={selectedOpportunity ? bookmarks.includes(selectedOpportunity.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onOpenZ83Assistant={handleOpenZ83}
        onReportListing={handleReportListing}
      />

      <Z83AssistantModal
        opportunity={activeZ83Opportunity}
        isOpen={z83ModalOpen}
        onClose={() => setZ83ModalOpen(false)}
      />

      <ScamSandboxModal
        isOpen={scamSandboxOpen}
        onClose={() => setScamSandboxOpen(false)}
      />

      <FeedMonitorModal
        isOpen={feedMonitorOpen}
        onClose={() => setFeedMonitorOpen(false)}
        feeds={feeds}
        syncLogs={syncLogs}
        onTriggerSync={handleTriggerSync}
        onAddFeed={handleAddFeed}
      />

      <CVBuilderModal
        isOpen={cvBuilderOpen}
        onClose={() => setCvBuilderOpen(false)}
      />

      <ApplicationTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        applications={applications}
        onUpdateStatus={handleUpdateApplicationStatus}
        onDeleteApplication={handleDeleteApplication}
        onAddApplication={handleAddApplication}
        onOpenZ83={handleOpenZ83}
      />

      <JobAlertsModal
        isOpen={jobAlertsOpen}
        onClose={() => setJobAlertsOpen(false)}
        onSaveAlert={(msg) => showToast(msg)}
      />

      <AuthModal
        isOpen={authModal.open}
        mode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('opphub_user_v1', JSON.stringify(user));
          showToast(`Welcome, ${user.name}! Logged in as ${user.role === 'recruiter' ? 'Verified Recruiter' : 'Jobseeker'}.`);
        }}
      />

      {/* Floating Real-Time Ingest Notification */}
      {floatingLiveBanner && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex flex-col gap-2.5 transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                ⚡ Streamed In Live Just Now
              </span>
            </div>
            <button
              onClick={() => setFloatingLiveBanner(null)}
              className="text-neutral-400 hover:text-white text-xs px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white line-clamp-1">
              {floatingLiveBanner.title}
            </h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              {floatingLiveBanner.organization} · {floatingLiveBanner.city}, {floatingLiveBanner.province}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
            <span className="text-emerald-400 font-semibold">100% Free · Scam Quarantine Passed</span>
            <button
              onClick={() => {
                handleSelectOpportunity(floatingLiveBanner);
                setFloatingLiveBanner(null);
              }}
              className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-colors cursor-pointer"
            >
              View Details →
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
