import React, { useState } from 'react';
import { analyzeScamRisk } from '../utils/integrityEngine';
import { ScamAssessment } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, X, Search, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';

interface ScamSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScamSandboxModal: React.FC<ScamSandboxModalProps> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [assessment, setAssessment] = useState<ScamAssessment | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    const result = analyzeScamRisk(inputText, inputEmail);
    setAssessment(result);
  };

  const loadExample = (type: 'scam' | 'legitimate') => {
    if (type === 'scam') {
      setInputText(
        'URGENT HIRING: 80 General Workers & Cleaners needed at Pretoria District Hospital. Salary R14,500/month. No matric required. Send your name, ID copy and R280 Pep Pax code for safety uniform & medical clearance badge to Sister Nomsa on WhatsApp 072 123 4567.'
      );
      setInputEmail('district.hospital.recruitment@gmail.com');
      const res = analyzeScamRisk(
        'URGENT HIRING: 80 General Workers & Cleaners needed at Pretoria District Hospital. Salary R14,500/month. No matric required. Send your name, ID copy and R280 Pep Pax code for safety uniform & medical clearance badge to Sister Nomsa on WhatsApp 072 123 4567.',
        'district.hospital.recruitment@gmail.com'
      );
      setAssessment(res);
    } else {
      setInputText(
        'Administrative Clerk (Production): Department of Water and Sanitation. Reference: DWS/2026/04. Requirements: Grade 12 Certificate. Salary: R216,417 per annum (Level 05). Applications must be submitted on the New Z83 form to recruitment@dws.gov.za or hand delivered to Sedibeng House, Pretoria.'
      );
      setInputEmail('recruitment@dws.gov.za');
      const res = analyzeScamRisk(
        'Administrative Clerk (Production): Department of Water and Sanitation. Reference: DWS/2026/04. Requirements: Grade 12 Certificate. Salary: R216,417 per annum (Level 05). Applications must be submitted on the New Z83 form to recruitment@dws.gov.za or hand delivered to Sedibeng House, Pretoria.',
        'recruitment@dws.gov.za',
        'dws.gov.za'
      );
      setAssessment(res);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                South African Job Scam & Fraud Checker
              </h3>
              <p className="text-xs text-neutral-400">
                Screen WhatsApp forwards, SMS broadcasts, or classified listings against fake job patterns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-neutral-600 font-medium">Test with authentic scenarios:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadExample('scam')}
                className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
              >
                Load Fake WhatsApp Job Scam
              </button>
              <button
                type="button"
                onClick={() => loadExample('legitimate')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
              >
                Load Real DPSA Circular Text
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Paste Job Advertisement or Message Text
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the advert text, WhatsApp forward, or email body here..."
              className="w-full p-3 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Contact Email / Application Address (Optional)
            </label>
            <input
              type="text"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="e.g. hr.department@gmail.com or vacancies@dpsa.gov.za"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Run Scam Detection Check
            </button>
          </div>

          {/* Results panel */}
          {assessment && (
            <div className="mt-4 pt-4 border-t border-neutral-200 space-y-3">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  assessment.riskLevel === 'flagged_scam'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : assessment.riskLevel === 'under_review'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    Integrity Rating
                  </div>
                  <div className="text-lg font-bold">
                    {assessment.riskLevel === 'flagged_scam' && 'CRITICAL: High Fraud / Scam Probability'}
                    {assessment.riskLevel === 'under_review' && 'CAUTION: Unverified Attributes (Under Review)'}
                    {assessment.riskLevel === 'verified_official' && 'VERIFIED: Official Legitimate Opportunity'}
                    {assessment.riskLevel === 'low_risk' && 'LOW RISK: Standard Recruitment Patterns'}
                  </div>
                  {assessment.scamWarningNotes && (
                    <p className="text-xs mt-1 font-medium">{assessment.scamWarningNotes}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs uppercase text-neutral-500 font-medium">Safety Score</div>
                  <div className="text-3xl font-extrabold font-mono tabular-nums">
                    {assessment.safetyScore}/100
                  </div>
                </div>
              </div>

              {/* Checklist Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-700">Detailed Heuristic Rules</div>
                {assessment.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">{check.rule}</span>
                      <span
                        className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                          check.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {check.passed ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </div>
                    <p className="text-neutral-600">{check.details}</p>
                  </div>
                ))}
              </div>

              {/* South Africa Scam Advisory */}
              <div className="p-3.5 bg-neutral-100 rounded-lg text-xs text-neutral-700 space-y-1">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-neutral-500" />
                  South African National Anti-Corruption Helpline
                </div>
                <p>
                  If someone demands money, uniform deposits, or money codes (Pep Pax, eWallet) for a job, report them to the Public Service Anti-Corruption Hotline at <strong>0800 701 701</strong> or your nearest SAPS station. Legitimate employers in South Africa NEVER charge candidates to apply.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
