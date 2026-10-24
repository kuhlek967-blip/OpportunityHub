import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Opportunity } from '../types';

interface RealTimeFeedBarProps {
  totalLegitCount: number;
  totalIngestedCount: number;
  isAutoSyncing: boolean;
  secondsUntilNextSync: number;
  syncInterval: number;
  isStreamPaused: boolean;
  soundEnabled: boolean;
  latestIngestedJob: Opportunity | null;
  onTogglePause: () => void;
  onToggleSound: () => void;
  onChangeInterval: (seconds: number) => void;
  onTriggerSyncNow: () => void;
  onViewJob: (job: Opportunity) => void;
}

export const RealTimeFeedBar: React.FC<RealTimeFeedBarProps> = ({
  totalLegitCount,
  totalIngestedCount,
  isAutoSyncing,
  secondsUntilNextSync,
  syncInterval,
  isStreamPaused,
  soundEnabled,
  latestIngestedJob,
  onTogglePause,
  onToggleSound,
  onChangeInterval,
  onTriggerSyncNow,
  onViewJob,
}) => {
  // Live ticker items cycling
  const tickerItems = [
    '⚡ LIVE: Direct WhatsApp intake active for Shoprite & Checkers cashiers (087 240 5709)',
    '🛡️ ZERO FEES: Anti-scam engine verifying 100% free application status on all incoming feeds',
    '🛍️ RECRUITING: Woolworths, Pick n Pay, SPAR, Boxer, PEP Stores & Clicks streaming vacancies',
    '🏛️ DPSA CIRCULAR: National public service vacancies verified on official .gov.za domains',
    '✨ INSTANT MATCH: Grade 10, Grade 11 & Matric verified entry-level roles updating continuously',
  ];

  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  // Compute countdown percentage
  const progressPercent = Math.max(
    0,
    Math.min(100, ((syncInterval - secondsUntilNextSync) / syncInterval) * 100)
  );

  return (
    <div className="mb-6 bg-gradient-to-r from-[#0B1A3D] via-[#0F2942] to-[#004D3A] text-white rounded-2xl p-4 sm:p-5 shadow-md border border-neutral-800">
      {/* Top Header Row: Status, Ticker, and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-white/10">
        {/* Left: Live Beacon & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isStreamPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping opacity-75'
              } absolute`}
            />
            <span
              className={`relative w-3.5 h-3.5 rounded-full ${
                isStreamPaused ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                {isStreamPaused ? 'REAL-TIME FEED PAUSED' : 'REAL-TIME LIVE STREAM ACTIVE'}
              </span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-semibold text-white/90">
                100% Free · Scam Quarantine Active
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Continuously streaming verified job openings from SA supermarkets, SOEs & Government
            </p>
          </div>
        </div>

        {/* Right: Live Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Pause / Resume */}
          <button
            onClick={onTogglePause}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              isStreamPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isStreamPaused ? 'Resume live real-time feed' : 'Pause real-time stream'}
          >
            {isStreamPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Resume Stream</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="inline-flex items-center bg-white/10 rounded-lg p-0.5 text-[11px] font-medium">
            <button
              onClick={() => onChangeInterval(15)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                syncInterval === 15 ? 'bg-emerald-500 text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="Poll feeds every 15 seconds"
            >
              Live 15s
            </button>
            <button
              onClick={() => onChangeInterval(30)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                syncInterval === 30 ? 'bg-emerald-500 text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="Poll feeds every 30 seconds"
            >
              30s
            </button>
            <button
              onClick={() => onChangeInterval(60)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                syncInterval === 60 ? 'bg-emerald-500 text-white font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="Poll feeds every 60 seconds"
            >
              60s
            </button>
          </div>

          {/* Sound Notification Alert Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/30 text-emerald-300 hover:bg-emerald-500/40 border border-emerald-400/30'
                : 'bg-white/10 text-neutral-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Live sound chime enabled' : 'Muted (Click to enable live sound)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Trigger Ingest Now Button */}
          <button
            onClick={onTriggerSyncNow}
            disabled={isAutoSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Scan official feeds right now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing ? 'animate-spin' : ''}`} />
            <span>{isAutoSyncing ? 'Scanning...' : 'Sync Now ⚡'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar: Live Ticker + Real-Time Sync Countdown */}
      <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Live Newsflash Rotating Ticker */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Live Feed
          </span>
          <p className="truncate text-neutral-200 text-xs transition-opacity duration-300 font-medium">
            {tickerItems[activeTickerIndex]}
          </p>
        </div>

        {/* Live Countdown & Stats */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          {!isStreamPaused ? (
            <div className="flex items-center gap-2 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
              <span className="text-neutral-300">Next feed scan:</span>
              <span className="font-mono font-bold text-emerald-400">
                {secondsUntilNextSync}s
              </span>
              <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-amber-300 font-medium bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              Stream Paused
            </span>
          )}

          <div className="text-[11px] text-neutral-300 font-medium hidden sm:block">
            <span className="font-bold text-white">{totalLegitCount}</span> verified legit jobs online
          </div>
        </div>
      </div>

      {/* Latest Streamed In Banner (if any recently arrived) */}
      {latestIngestedJob && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3 bg-white/5 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5 sm:py-2.5 rounded-b-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide shrink-0">
              ⚡ Just In Stream:
            </span>
            <span className="text-xs font-semibold text-white truncate">
              {latestIngestedJob.title}
            </span>
            <span className="text-xs text-neutral-300 truncate hidden md:inline">
              — {latestIngestedJob.organization} ({latestIngestedJob.province})
            </span>
          </div>

          <button
            onClick={() => onViewJob(latestIngestedJob)}
            className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <span>View Job</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
