import React from 'react';
import { Opportunity } from '../types';
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  isJustStreamed?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  isJustStreamed = false,
}) => {
  const isScam = opportunity.scamAssessment.riskLevel === 'flagged_scam';
  const hasWhatsApp = opportunity.enquiriesContact?.phone?.toLowerCase().includes('whatsapp');

  // Config based on opportunity type
  const typeConfig: Record<
    string,
    {
      circleBg: string;
      icon: React.ReactNode;
      tagBg: string;
      tagText: string;
      label: string;
    }
  > = {
    shop_job: {
      circleBg: 'bg-[#E11D48]',
      icon: <ShoppingBag className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#FFE4E6] text-[#BE123C]',
      tagText: 'text-[#BE123C]',
      label: 'Shop Job',
    },
    entry_level: {
      circleBg: 'bg-[#0077D8]',
      icon: <Briefcase className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#E3F2FD] text-[#0284C7]',
      tagText: 'text-[#0284C7]',
      label: 'Job',
    },
    government_circular: {
      circleBg: 'bg-[#0077D8]',
      icon: <Briefcase className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#E3F2FD] text-[#0284C7]',
      tagText: 'text-[#0284C7]',
      label: 'Gov Circular',
    },
    internship: {
      circleBg: 'bg-[#00875A]',
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#E8F5E9] text-[#2E7D32]',
      tagText: 'text-[#2E7D32]',
      label: 'Internship',
    },
    graduate_programme: {
      circleBg: 'bg-[#00875A]',
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#E8F5E9] text-[#2E7D32]',
      tagText: 'text-[#2E7D32]',
      label: 'Graduate',
    },
    learnership: {
      circleBg: 'bg-[#7C3AED]',
      icon: <BookOpen className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#F3E8FF] text-[#7C3AED]',
      tagText: 'text-[#7C3AED]',
      label: 'Learnership',
    },
    artisan_apprenticeship: {
      circleBg: 'bg-[#7C3AED]',
      icon: <BookOpen className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#F3E8FF] text-[#7C3AED]',
      tagText: 'text-[#7C3AED]',
      label: 'Apprenticeship',
    },
    bursary: {
      circleBg: 'bg-[#FF9500]',
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      tagBg: 'bg-[#FFF3E0] text-[#E65100]',
      tagText: 'text-[#E65100]',
      label: 'Bursary',
    },
  };

  const config = typeConfig[opportunity.opportunityType] || typeConfig['entry_level'];

  const qualLabels: Record<string, string> = {
    no_matric: 'No Matric required',
    matric: 'Grade 12',
    tvet_n6: 'TVET N4-N6 or equivalent',
    diploma: 'IT qualification or equivalent',
    degree: 'Degree in Computer Science or related field',
    postgraduate: 'Postgraduate degree',
  };

  // Format closing date as "Closes: 30 Nov 2025"
  const formatClosingDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `Closes: ${d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
    } catch {
      return `Closes: ${dateStr}`;
    }
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className={`rounded-xl border p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative ${
        isJustStreamed
          ? 'bg-gradient-to-b from-emerald-50/40 via-white to-white border-emerald-400 ring-2 ring-emerald-500/40 shadow-md animate-fade-in'
          : 'bg-white border-neutral-200/90 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Live Stream Pulse Beacon if just arrived */}
      {isJustStreamed && (
        <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>⚡ Live Streamed</span>
        </div>
      )}

      <div>
        {/* Top Icon and Tag */}
        <div className="flex items-center gap-3 mb-3.5">
          <div
            className={`w-10 h-10 rounded-full ${config.circleBg} flex items-center justify-center shrink-0 shadow-xs`}
          >
            {config.icon}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${config.tagBg}`}
          >
            {config.label}
          </span>
          {!isScam && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full ml-auto">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              100% Free · Verified
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#00674F] transition-colors line-clamp-2 leading-snug">
          {opportunity.title}
        </h3>

        {/* Company / Department */}
        <div className="text-xs text-neutral-500 font-medium mt-1 mb-2.5 truncate flex items-center justify-between">
          <span className="truncate">{opportunity.organization}</span>
          {hasWhatsApp && (
            <span className="text-[10px] font-bold text-[#00674F] bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
              WhatsApp Apply
            </span>
          )}
        </div>

        {/* Scam Warning Badge if flagged */}
        {isScam && (
          <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>SUSPICIOUS POST: Possible fee scam</span>
          </div>
        )}

        {/* Salary / Stipend Highlight */}
        {opportunity.stipendOrSalary && (
          <div className="mb-3 px-2.5 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center gap-2 text-xs font-semibold text-neutral-800">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{opportunity.stipendOrSalary}</span>
          </div>
        )}

        {/* Key Attributes */}
        <div className="space-y-2 text-xs text-neutral-600 mb-4 pt-1 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">
              {opportunity.city}, {opportunity.province}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate font-medium text-neutral-800">
              {qualLabels[opportunity.qualification] || opportunity.qualification}
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-500">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-mono">{formatClosingDate(opportunity.closingDate)}</span>
          </div>
        </div>
      </div>

      {/* Button: Full-width deep green button View Details → */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(opportunity);
        }}
        className="w-full bg-[#00674F] hover:bg-[#00533F] text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs mt-1"
      >
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
