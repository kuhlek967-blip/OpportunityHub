import React, { useState } from 'react';
import {
  Search,
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { OpportunityType, Province, QualificationLevel } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  selectedLocation: string;
  selectedQualification: string;
  onSearchChange: (q: string) => void;
  onLocationChange: (loc: string) => void;
  onQualificationChange: (qual: string) => void;
  onExecuteSearch: () => void;
  onSelectCategory: (type: OpportunityType | 'all') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  selectedLocation,
  selectedQualification,
  onSearchChange,
  onLocationChange,
  onQualificationChange,
  onExecuteSearch,
  onSelectCategory,
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

  const qualifications: { value: QualificationLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Qualifications' },
    { value: 'no_matric', label: 'No Matric Required' },
    { value: 'matric', label: 'Grade 12 / Matric' },
    { value: 'tvet_n6', label: 'TVET N4-N6' },
    { value: 'diploma', label: 'National Diploma' },
    { value: 'degree', label: 'Bachelor’s Degree' },
    { value: 'postgraduate', label: 'Postgraduate' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FC] to-[#FAFCFD] border-b border-neutral-200 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subtitle, Search bar */}
          <div className="lg:col-span-8 space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl font-black text-[#0B1A3D] tracking-tight leading-[1.15]">
              Your Future Starts Here
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed">
              Find genuine jobs, internships, learnerships and bursaries across South Africa — all in one place.
            </p>

            {/* Structured Search Bar */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200/90 p-1.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-3xl">
              {/* Text Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for a job, internship, learnership or bursary..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onExecuteSearch()}
                  className="w-full text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-neutral-200 shrink-0" />

              {/* Location Dropdown */}
              <div className="relative flex items-center px-3 py-2 min-w-[140px]">
                <MapPin className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full text-xs sm:text-sm text-neutral-700 font-medium bg-transparent focus:outline-none cursor-pointer appearance-none pr-5"
                >
                  <option value="all">Location</option>
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 pointer-events-none" />
              </div>

              <div className="hidden md:block w-px h-8 bg-neutral-200 shrink-0" />

              {/* Qualification Dropdown */}
              <div className="relative flex items-center px-3 py-2 min-w-[150px]">
                <GraduationCap className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                <select
                  value={selectedQualification}
                  onChange={(e) => onQualificationChange(e.target.value)}
                  className="w-full text-xs sm:text-sm text-neutral-700 font-medium bg-transparent focus:outline-none cursor-pointer appearance-none pr-5"
                >
                  <option value="all">Qualification</option>
                  {qualifications.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button
                onClick={onExecuteSearch}
                className="bg-[#00674F] hover:bg-[#00533F] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

            {/* 5 Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 pt-2">
              {/* Shop Jobs */}
              <div
                onClick={() => onSelectCategory('shop_job')}
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white p-3 sm:p-3.5 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#E11D48] flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm leading-tight">Shop Jobs</h3>
                    <p className="text-[10px] text-rose-100 mt-0.5 leading-tight truncate max-w-[90px] sm:max-w-none">
                      Supermarkets & retail
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 hidden sm:block" />
              </div>

              {/* Jobs */}
              <div
                onClick={() => onSelectCategory('entry_level')}
                className="bg-[#0077D8] hover:bg-[#0069C0] text-white p-3 sm:p-3.5 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#0077D8] flex items-center justify-center shrink-0 shadow-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm leading-tight">Jobs</h3>
                    <p className="text-[10px] text-blue-100 mt-0.5 leading-tight truncate max-w-[90px] sm:max-w-none">
                      Full & part-time
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 hidden sm:block" />
              </div>

              {/* Internships */}
              <div
                onClick={() => onSelectCategory('internship')}
                className="bg-[#00875A] hover:bg-[#00754E] text-white p-3 sm:p-3.5 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#00875A] flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm leading-tight">Internships</h3>
                    <p className="text-[10px] text-emerald-100 mt-0.5 leading-tight truncate max-w-[90px] sm:max-w-none">
                      Gain experience
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 hidden sm:block" />
              </div>

              {/* Learnerships */}
              <div
                onClick={() => onSelectCategory('learnership')}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white p-3 sm:p-3.5 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm leading-tight">Learnerships</h3>
                    <p className="text-[10px] text-purple-100 mt-0.5 leading-tight truncate max-w-[90px] sm:max-w-none">
                      Learn while working
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 hidden sm:block" />
              </div>

              {/* Bursaries */}
              <div
                onClick={() => onSelectCategory('bursary')}
                className="bg-[#FF9500] hover:bg-[#E68600] text-white p-3 sm:p-3.5 rounded-xl shadow-sm flex items-center justify-between cursor-pointer transition-transform hover:-translate-y-0.5 col-span-2 sm:col-span-1"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#FF9500] flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm leading-tight">Bursaries</h3>
                    <p className="text-[10px] text-amber-100 mt-0.5 leading-tight truncate max-w-[90px] sm:max-w-none">
                      Fund your studies
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Student and Cape Town Mountain */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <div className="relative max-w-sm lg:max-w-none">
              <img
                src="/src/assets/images/hero_student_clean.png"
                alt="Young South African smiling student holding books with Table Mountain background"
                className="w-full h-auto object-contain rounded-2xl drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
