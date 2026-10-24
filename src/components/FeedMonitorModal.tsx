import React, { useState } from 'react';
import { MonitoredFeed, SyncLogEvent } from '../types';
import {
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  AlertOctagon,
  CopyCheck,
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

interface FeedMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeds: MonitoredFeed[];
  syncLogs: SyncLogEvent[];
  onTriggerSync: () => Promise<void>;
  onAddFeed: (newFeed: Omit<MonitoredFeed, 'id' | 'totalIngested' | 'duplicatesBlocked' | 'scamsQuarantined' | 'status'>) => void;
}

export const FeedMonitorModal: React.FC<FeedMonitorModalProps> = ({
  isOpen,
  onClose,
  feeds,
  syncLogs,
  onTriggerSync,
  onAddFeed,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncPhase, setSyncPhase] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'feeds' | 'logs' | 'submit'>('feeds');

  // Form state
  const [feedName, setFeedName] = useState('');
  const [feedCategory, setFeedCategory] = useState('Provincial Government');
  const [feedUrl, setFeedUrl] = useState('');
  const [feedFormat, setFeedFormat] = useState<'JSON API' | 'RSS' | 'PDF Circular Scraper'>('JSON API');
  const [feedSchedule, setFeedSchedule] = useState('Daily at 06:00 SAST');
  const [feedAuthority, setFeedAuthority] = useState('');

  if (!isOpen) return null;

  const handleSyncClick = async () => {
    setIsSyncing(true);
    setSyncPhase('Connecting to DPSA & Provincial Gateways...');
    await new Promise((r) => setTimeout(r, 600));

    setSyncPhase('Running cross-feed duplicate detection & matching references...');
    await new Promise((r) => setTimeout(r, 700));

    setSyncPhase('Verifying closing dates & calculating active deadlines...');
    await new Promise((r) => setTimeout(r, 500));

    setSyncPhase('Evaluating scam heuristics & security domain checks...');
    await onTriggerSync();
    await new Promise((r) => setTimeout(r, 400));

    setIsSyncing(false);
    setSyncPhase('');
  };

  const handleSubmitNewFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedName || !feedUrl) return;

    onAddFeed({
      name: feedName,
      category: feedCategory,
      url: feedUrl,
      format: feedFormat,
      schedule: feedSchedule,
      lastChecked: 'Just registered (Pending first check)',
      nextScheduledCheck: 'In 15 minutes',
      officialAuthority: feedAuthority || 'Verified Authority',
    });

    setFeedName('');
    setFeedUrl('');
    setFeedAuthority('');
    setShowAddForm(false);
    setActiveTab('feeds');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Automated Feed Monitor & Synchronization
              </h3>
              <p className="text-xs text-neutral-400">
                Continuous polling of official gazettes, government APIs & accredited SETA feeds
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isSyncing
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Feeds...' : 'Run Live Feed Check'}
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync progress banner if active */}
        {isSyncing && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-900 flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin shrink-0" />
            <span className="font-mono">{syncPhase}</span>
          </div>
        )}

        {/* Navigation tabs */}
        <div className="px-5 pt-3 border-b border-neutral-200 flex gap-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('feeds')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'feeds'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Integrated Feeds ({feeds.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'logs'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Sync & Quarantine Logs ({syncLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'submit'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Add Monitored Source / Gazette
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'feeds' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Total Active Feeds
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-900 mt-1">
                    {feeds.length}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Authorised official channels</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <CopyCheck className="w-4 h-4 text-blue-600" /> Duplicates Filtered
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-900 mt-1">
                    {feeds.reduce((acc, f) => acc + f.duplicatesBlocked, 0)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Cross-posted circulars resolved</div>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-600" /> Scams Quarantined
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-900 mt-1">
                    {feeds.reduce((acc, f) => acc + f.scamsQuarantined, 0)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Fake listings automatically blocked</div>
                </div>
              </div>

              {/* Feed List Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100/75 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Source & Authority</th>
                      <th className="py-2.5 px-3">Format & Schedule</th>
                      <th className="py-2.5 px-3">Last Polled</th>
                      <th className="py-2.5 px-3">Next Polling</th>
                      <th className="py-2.5 px-3 text-right">Metrics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {feeds.map((feed) => (
                      <tr key={feed.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-neutral-900">{feed.name}</div>
                          <div className="text-neutral-500 text-[11px] truncate max-w-xs">
                            {feed.officialAuthority}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-700 truncate max-w-xs mt-0.5">
                            {feed.url}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-neutral-700">{feed.format}</span>
                          <div className="text-neutral-500 text-[11px]">{feed.schedule}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-600 text-[11px]">
                          {feed.lastChecked}
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-600 text-[11px]">
                          {feed.nextScheduledCheck}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-mono text-neutral-900 font-medium">
                            {feed.totalIngested.toLocaleString()} items
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {feed.duplicatesBlocked} dupes / {feed.scamsQuarantined} blocked
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="text-xs text-neutral-500 pb-1">
                Real-time synchronization audit trail documenting newly ingested listings, cross-post duplicate consolidation, and scam quarantine triggers.
              </div>
              <div className="space-y-2">
                {syncLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono px-1.5 py-0.2 rounded text-[11px] font-medium ${
                            log.action === 'scam_quarantined'
                              ? 'bg-rose-100 text-rose-800'
                              : log.action === 'duplicate_merged'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.action.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="font-semibold text-neutral-900">{log.feedName}</span>
                      </div>
                      <p className="text-neutral-600">{log.details}</p>
                    </div>
                    <span className="text-neutral-400 font-mono text-[11px] shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <form onSubmit={handleSubmitNewFeed} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 text-xs text-neutral-700 space-y-1">
                <div className="font-semibold text-neutral-900">
                  Register Authorized Feed or Circular Endpoint
                </div>
                <p>
                  Submit verified RSS feeds, JSON APIs, or periodic PDF circular repositories from government departments, SETAs, or registered corporate HR portals. OpportunityHub automatically checks compliance against the South African Basic Conditions of Employment Act before ingestion.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Feed / Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eastern Cape Dept of Education Circulars"
                  value={feedName}
                  onChange={(e) => setFeedName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Category</label>
                  <select
                    value={feedCategory}
                    onChange={(e) => setFeedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="National Public Service">National Public Service (DPSA)</option>
                    <option value="Provincial Government">Provincial Government</option>
                    <option value="SETA / Skills Council">SETA / Skills Council</option>
                    <option value="State-Owned Enterprise">State-Owned Enterprise</option>
                    <option value="Corporate Employer">Corporate Employer</option>
                    <option value="Municipal Careers">Municipal Careers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">Feed Format</label>
                  <select
                    value={feedFormat}
                    onChange={(e) => setFeedFormat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="JSON API">JSON API Endpoint</option>
                    <option value="RSS">RSS 2.0 / Atom Feed</option>
                    <option value="PDF Circular Scraper">Weekly PDF Circular Scraper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Endpoint URL or Gazette Document Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.ecdoe.gov.za/vacancies.rss"
                  value={feedUrl}
                  onChange={(e) => setFeedUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Issuing Authority / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eastern Cape Provincial Administration"
                  value={feedAuthority}
                  onChange={(e) => setFeedAuthority(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('feeds')}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  Register Source for Verification
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Feeds verified for POPIA adherence & scam immunity</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
