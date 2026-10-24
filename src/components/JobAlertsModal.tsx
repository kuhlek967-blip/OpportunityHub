import React, { useState } from 'react';
import { Bell, CheckCircle2, MessageSquare, Mail, X } from 'lucide-react';
import { Province, OpportunityType } from '../types';

interface JobAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (summary: string) => void;
}

export const JobAlertsModal: React.FC<JobAlertsModalProps> = ({
  isOpen,
  onClose,
  onSaveAlert,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('Gauteng');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('072 123 4567');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    onSaveAlert(`Alert active for ${selectedType} in ${selectedProvince} via ${contactMethod}`);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-[#00674F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Set Free Job Alerts</h3>
              <p className="text-xs text-white/80">
                Receive newly published DPSA circulars & SETA learnerships instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Select Your Target Province
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F] font-medium"
            >
              <option value="All South Africa">All South Africa (National)</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Opportunity Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F] font-medium"
            >
              <option value="all">All Opportunities (Jobs, Learnerships, Bursaries)</option>
              <option value="government_circular">Government DPSA Vacancies</option>
              <option value="learnership">SETA Learnerships</option>
              <option value="internship">Internships & Work Experience</option>
              <option value="bursary">Bursary Schemes</option>
              <option value="artisan_apprenticeship">Artisan / Trade Apprenticeships</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Delivery Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContactMethod('whatsapp')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  contactMethod === 'whatsapp'
                    ? 'border-[#00674F] bg-emerald-50/60 text-[#00674F] font-bold'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Message</span>
              </button>

              <button
                type="button"
                onClick={() => setContactMethod('email')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  contactMethod === 'email'
                    ? 'border-[#00674F] bg-emerald-50/60 text-[#00674F] font-bold'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email Digest</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              {contactMethod === 'whatsapp' ? 'WhatsApp Mobile Number' : 'Email Address'}
            </label>
            <input
              type={contactMethod === 'whatsapp' ? 'tel' : 'email'}
              required
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={contactMethod === 'whatsapp' ? '072 123 4567' : 'you@example.com'}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
            />
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg text-neutral-600 text-[11px] leading-relaxed">
            OpportunityHub will never spam you or share your details. You can pause or cancel alerts at any time by replying STOP.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-[#00674F] hover:bg-[#00503D] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Alert Activated!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Activate Free Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
