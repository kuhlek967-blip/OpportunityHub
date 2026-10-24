import React from 'react';
import { Province, OpportunityType, QualificationLevel } from '../types';
import { Search, X, SlidersHorizontal, ShieldAlert, Bookmark } from 'lucide-react';

interface FilterState {
  search: string;
  province: string;
  opportunityType: string;
  qualification: string;
  urgency: string; // 'all' | '3_days' | '14_days' | 'this_month'
  showScams: boolean;
  onlyBookmarked: boolean;
}

interface OpportunityFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  bookmarkedCount: number;
  quarantinedCount: number;
}

export const OpportunityFilterBar: React.FC<OpportunityFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  bookmarkedCount,
  quarantinedCount,
}) => {
  const provinces: Province[] = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Limpopo',
    'Mpumalanga',
    'Free State',
    'North West',
    'Northern Cape',
    'National / Remote',
  ];

  const types: { value: OpportunityType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Opportunity Types' },
    { value: 'shop_job', label: '🛍️ Shop & Supermarket Recruitments' },
    { value: 'entry_level', label: 'Entry-Level Jobs' },
    { value: 'government_circular', label: 'Government Circulars (DPSA)' },
    { value: 'learnership', label: 'SETA Learnerships' },
    { value: 'internship', label: 'Workplace Internships' },
    { value: 'artisan_apprenticeship', label: 'Artisan & Trade Apprenticeships' },
    { value: 'graduate_programme', label: 'Graduate Programmes' },
    { value: 'bursary', label: 'Full Bursary Funding' },
  ];

  const qualifications: { value: QualificationLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Education Levels' },
    { value: 'no_matric', label: 'No Matric Required (Grade 10/11)' },
    { value: 'matric', label: 'Matric / Grade 12 Senior Cert' },
    { value: 'tvet_n6', label: 'TVET Nated N4-N6 / NCV' },
    { value: 'diploma', label: 'National Diploma / Higher Cert' },
    { value: 'degree', label: 'Bachelor’s Degree' },
    { value: 'postgraduate', label: 'Postgraduate / Honours / Masters' },
  ];

  const isFiltered =
    filters.search !== '' ||
    filters.province !== 'all' ||
    filters.opportunityType !== 'all' ||
    filters.qualification !== 'all' ||
    filters.urgency !== 'all' ||
    filters.onlyBookmarked ||
    filters.showScams;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Primary Views */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, department, reference number (e.g. DPSA/2026), or city..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Toggle (All vs Bookmarked) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg shrink-0">
          <button
            onClick={() => onFilterChange({ ...filters, onlyBookmarked: false })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              !filters.onlyBookmarked
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Verified ({totalCount})
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, onlyBookmarked: true })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filters.onlyBookmarked
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved ({bookmarkedCount})
          </button>
        </div>
      </div>

      {/* Structured Dropdown Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Province Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Province
          </label>
          <select
            value={filters.province}
            onChange={(e) => onFilterChange({ ...filters, province: e.target.value })}
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <option value="all">All 9 SA Provinces + Remote</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Opportunity Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Opportunity Type
          </label>
          <select
            value={filters.opportunityType}
            onChange={(e) => onFilterChange({ ...filters, opportunityType: e.target.value })}
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Qualification Level */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Qualification Needed
          </label>
          <select
            value={filters.qualification}
            onChange={(e) => onFilterChange({ ...filters, qualification: e.target.value })}
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            {qualifications.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>

        {/* Closing Date Urgency */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Closing Date Urgency
          </label>
          <select
            value={filters.urgency}
            onChange={(e) => onFilterChange({ ...filters, urgency: e.target.value })}
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <option value="all">All Active Deadlines</option>
            <option value="3_days">Closing Urgent (Within 3 Days)</option>
            <option value="14_days">Closing Within 2 Weeks</option>
            <option value="this_month">Closing Before Month End</option>
          </select>
        </div>
      </div>

      {/* Filter Bottom Strip: Scam Quarantine Toggle & Active Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-neutral-500">
            Showing <strong className="text-neutral-900 font-mono">{filteredCount}</strong> of{' '}
            <span className="font-mono">{totalCount}</span> listings
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Safety & Scam Quarantine Toggle */}
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-neutral-600 hover:text-neutral-900 select-none">
            <input
              type="checkbox"
              checked={filters.showScams}
              onChange={(e) => onFilterChange({ ...filters, showScams: e.target.checked })}
              className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 h-3.5 w-3.5"
            />
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Show quarantined scam examples ({quarantinedCount})</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
