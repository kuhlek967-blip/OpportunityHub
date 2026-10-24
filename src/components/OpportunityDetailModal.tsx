import React, { useState } from 'react';
import { Opportunity } from '../types';
import { getClosingDateStatus } from '../utils/integrityEngine';
import {
  FileText,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  X,
  Mail,
  Building2,
  CopyCheck,
  ShieldAlert,
  Flag,
  Check,
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenZ83Assistant: (opp: Opportunity) => void;
  onReportListing: (opp: Opportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenZ83Assistant,
  onReportListing,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [reported, setReported] = useState(false);

  if (!isOpen || !opportunity) return null;

  const closingInfo = getClosingDateStatus(opportunity.closingDate);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇿🇦 Verified South African Opportunity:\n\n*${opportunity.title}*\nOrganization: ${opportunity.organization}\nReference: ${opportunity.referenceNumber}\nLocation: ${opportunity.city}, ${opportunity.province}\nClosing Date: ${opportunity.closingDate} (${closingInfo.formatted})\nStipend/Salary: ${opportunity.stipendOrSalary}\n\nVerified on OpportunityHub SA: Safe, verified official source.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?opp=${opportunity.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = () => {
    setReported(true);
    onReportListing(opportunity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-200 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              {/* Unboxed metadata separator */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 font-medium">
                <span className="text-neutral-900 font-semibold">{opportunity.organization}</span>
                <span aria-hidden="true">·</span>
                <span>{opportunity.province}</span>
                <span aria-hidden="true">·</span>
                <span>{opportunity.city}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-700">{opportunity.referenceNumber}</span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                {opportunity.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-neutral-100 text-xs">
            <div>
              <div className="text-neutral-500 font-medium">Closing Status</div>
              <div
                className={`font-semibold mt-0.5 font-mono ${
                  closingInfo.status === 'closing_soon' || closingInfo.status === 'today'
                    ? 'text-amber-700'
                    : closingInfo.status === 'expired'
                    ? 'text-rose-700'
                    : 'text-emerald-700'
                }`}
              >
                {closingInfo.formatted}
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Remuneration / Stipend</div>
              <div className="text-neutral-900 font-semibold font-mono mt-0.5 truncate">
                {opportunity.stipendOrSalary}
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Qualification</div>
              <div className="text-neutral-900 font-semibold mt-0.5 capitalize">
                {opportunity.qualification.replace('_', ' ')}
              </div>
            </div>

            <div>
              <div className="text-neutral-500 font-medium">Original Feed Source</div>
              <div className="text-neutral-900 font-semibold mt-0.5 truncate">
                {opportunity.source.name}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-neutral-700">
          {/* Integrity & Verification banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-3 ${
              opportunity.scamAssessment.riskLevel === 'flagged_scam'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : opportunity.scamAssessment.riskLevel === 'under_review'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {opportunity.scamAssessment.riskLevel === 'verified_official' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-semibold text-xs tracking-wide uppercase">
                  {opportunity.scamAssessment.riskLevel === 'verified_official'
                    ? 'Verified Official Source'
                    : opportunity.scamAssessment.riskLevel === 'flagged_scam'
                    ? 'Warning: Suspected Job Scam'
                    : 'Listing Integrity Status'}
                </span>
                <span className="text-xs font-mono font-bold">
                  (Safety Rating: {opportunity.scamAssessment.safetyScore}/100)
                </span>
              </div>
              <p className="text-xs opacity-90">
                {opportunity.scamAssessment.scamWarningNotes ||
                  `Verified against authorized government gazette archives (${opportunity.source.domain}). Zero application fees required.`}
              </p>
            </div>

            {opportunity.duplicateMeta.matchedSourcesCount > 1 && (
              <div className="shrink-0 flex items-center gap-1.5 text-xs text-neutral-600 bg-white/70 px-2.5 py-1 rounded-md border border-neutral-200">
                <CopyCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Cross-posted across {opportunity.duplicateMeta.matchedSourcesCount} feeds</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Opportunity Overview
            </h3>
            <p className="leading-relaxed text-neutral-800">{opportunity.summary}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Requirements & Eligibility
            </h3>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Duties */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Key Duties & Practical Exposure
            </h3>
            <ul className="space-y-2">
              {opportunity.duties.map((duty, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Apply Section */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Application Instructions
            </h3>

            {opportunity.z83Required && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white border border-neutral-200 rounded-lg">
                <div>
                  <div className="text-xs font-semibold text-neutral-900">
                    New Z83 Application Form Required
                  </div>
                  <p className="text-xs text-neutral-500">
                    This post requires the revised New Z83 form. Use our assistant to prefill reference numbers and avoid disqualification.
                  </p>
                </div>
                <button
                  onClick={() => onOpenZ83Assistant(opportunity)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Open Z83 Assistant
                </button>
              </div>
            )}

            {opportunity.handDeliveryAddress && (
              <div className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">Physical Registry Depot:</span>{' '}
                {opportunity.handDeliveryAddress}
              </div>
            )}

            {opportunity.enquiriesContact && (
              <div className="text-xs text-neutral-600 pt-1 border-t border-neutral-200 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>Enquiries:</strong> {opportunity.enquiriesContact.name}
                </span>
                {opportunity.enquiriesContact.phone && (
                  <span>
                    <strong>Tel:</strong> {opportunity.enquiriesContact.phone}
                  </span>
                )}
                {opportunity.enquiriesContact.email && (
                  <span>
                    <strong>Email:</strong> {opportunity.enquiriesContact.email}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(opportunity.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              WhatsApp Share
            </button>

            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share Link'}
            </button>

            <button
              onClick={handleReport}
              disabled={reported}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-neutral-500 hover:text-rose-700 transition-colors"
              title="Report suspicious details"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{reported ? 'Reported' : 'Report'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {opportunity.applicationPortalUrl ? (
              <a
                href={opportunity.applicationPortalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs ${
                  opportunity.opportunityType === 'shop_job'
                    ? 'bg-[#E11D48] hover:bg-[#BE123C]'
                    : 'bg-[#00674F] hover:bg-[#00533F]'
                }`}
              >
                <span>
                  {opportunity.opportunityType === 'shop_job'
                    ? 'Apply on Official Store Careers Portal'
                    : 'Go to Official Application Portal'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : opportunity.applicationEmail ? (
              <a
                href={`mailto:${opportunity.applicationEmail}?subject=Application: ${encodeURIComponent(
                  opportunity.title
                )} (${opportunity.referenceNumber})`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00533F] rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Email Application Directly
              </a>
            ) : (
              <button
                onClick={() => onOpenZ83Assistant(opportunity)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#00674F] hover:bg-[#00533F] rounded-lg transition-colors"
              >
                Submit via Z83 Physical Depot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
