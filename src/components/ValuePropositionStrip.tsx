import React from 'react';
import { ShieldCheck, Target, Bell, FileText } from 'lucide-react';

interface ValuePropositionStripProps {
  onLearnSafety: () => void;
  onOpenTracker: () => void;
  onOpenFilters: () => void;
}

export const ValuePropositionStrip: React.FC<ValuePropositionStripProps> = ({
  onLearnSafety,
  onOpenTracker,
  onOpenFilters,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
      <div className="bg-[#F0F8F6] border border-[#D5EAE4] rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div
            onClick={onLearnSafety}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#00674F] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#00674F] transition-colors">
                Verified Opportunities
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                We check for legitimacy so you can apply with confidence.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={onOpenFilters}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#00674F] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#00674F] transition-colors">
                Personalised Matching
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                Find opportunities that fit your qualifications and location.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={onOpenTracker}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#00674F] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#00674F] transition-colors">
                Deadline Reminders
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                Never miss an important date again.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={onOpenTracker}
            className="flex items-start gap-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#00674F] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#00674F] transition-colors">
                Track Your Applications
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-snug">
                Keep track of where you've applied and what's next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
