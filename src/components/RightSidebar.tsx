import {
  Zap,
  FileText,
  ClipboardList,
  Bell,
  MapPin,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

interface RightSidebarProps {
  onOpenCVBuilder: () => void;
  onOpenTracker: () => void;
  onOpenAlerts: () => void;
  onFindNearMe: () => void;
  onLearnSafety: () => void;
  onFilterShopJobs?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onOpenCVBuilder,
  onOpenTracker,
  onOpenAlerts,
  onFindNearMe,
  onLearnSafety,
  onFilterShopJobs,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick Tools Box */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-[#00674F] fill-[#00674F]" />
          <h3 className="text-sm font-bold text-neutral-900">Quick Access</h3>
        </div>

        <div className="space-y-1">
          {/* Shop Jobs Special Shortcut */}
          {onFilterShopJobs && (
            <div
              onClick={onFilterShopJobs}
              className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-100/70 border border-rose-100 cursor-pointer transition-colors group mb-1.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#BE123C] group-hover:text-[#9F1239] transition-colors leading-tight">
                    Shop & Store Jobs
                  </h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-tight">
                    Shoprite, Woolies, PnP & Mr Price
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#BE123C]" />
            </div>
          )}
          {/* Item 1 */}
          <div
            onClick={onOpenCVBuilder}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] text-[#0077D8] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#00674F] transition-colors leading-tight">
                  Create / Update Your CV
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  Build a professional CV in minutes
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>

          {/* Item 2 */}
          <div
            onClick={onOpenTracker}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#00875A] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#00674F] transition-colors leading-tight">
                  Application Tracker
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  Manage your applications and deadlines
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>

          {/* Item 3 */}
          <div
            onClick={onOpenAlerts}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] text-[#FF9500] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#00674F] transition-colors leading-tight">
                  Set Job Alerts
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  Get notified about new opportunities
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>

          {/* Item 4 */}
          <div
            onClick={onFindNearMe}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#00674F] transition-colors leading-tight">
                  Find Opportunities Near You
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  Use your location for better matches
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>
        </div>
      </div>

      {/* Stay Safe, Spot Scams Box */}
      <div className="bg-[#EAF6F2] border border-[#C6E8DD] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00674F] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900">
            Stay Safe, Spot Scams
          </h4>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          Be aware of fake job adverts. Never pay for a job, share your ID or bank details before verifying the employer.
        </p>

        <button
          onClick={onLearnSafety}
          className="text-xs font-bold text-[#00674F] hover:text-[#00503D] inline-flex items-center gap-1.5 transition-colors group"
        >
          <span>Learn more about job scams</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
