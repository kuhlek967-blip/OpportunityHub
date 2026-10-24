import React, { useState } from 'react';
import { Opportunity } from '../types';
import { FileText, CheckCircle2, AlertTriangle, Download, Copy, Check, ExternalLink, X } from 'lucide-react';

interface Z83AssistantModalProps {
  opportunity?: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Z83AssistantModal: React.FC<Z83AssistantModalProps> = ({
  opportunity,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guidelines' | 'checklist' | 'prefill'>('prefill');

  if (!isOpen) return null;

  const prefillContent = opportunity
    ? `DEPARTMENT: ${opportunity.organization} ${opportunity.department ? `(${opportunity.department})` : ''}
POSITION ADVERTISED: ${opportunity.title}
REFERENCE NUMBER: ${opportunity.referenceNumber}
CIRCULAR NUMBER: ${opportunity.source.circularRef || 'See Advert'}
CLOSING DATE: ${opportunity.closingDate}
CENTRE / LOCATION: ${opportunity.city}, ${opportunity.province}
APPLICATION SUBMISSION METHOD: ${opportunity.applicationMode === 'z83_form' ? 'Z83 with CV' : 'Online / Direct'}
ENQUIRIES CONTACT: ${opportunity.enquiriesContact?.name || 'Departmental HR Desk'} ${opportunity.enquiriesContact?.phone ? `(${opportunity.enquiriesContact.phone})` : ''}`
    : '';

  const handleCopyPrefill = () => {
    if (prefillContent) {
      navigator.clipboard.writeText(prefillContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                South African Z83 Application Assistant
              </h3>
              <p className="text-xs text-neutral-400">
                Official Public Service Form (Edition 81/971431 · Revised)
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

        {/* Tab switcher */}
        <div className="px-5 pt-3 border-b border-neutral-200 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('prefill')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'prefill'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Post Details Slip
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'guidelines'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Z83 Rules & DPSA Directive
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'checklist'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Disqualification Prevention Checklist
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-neutral-700 flex-1">
          {activeTab === 'prefill' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Match exact details:</span> Section A & B of your Z83 form MUST reflect the precise post designation and reference number below. Any mismatch causes automatic sorting rejection.
                </div>
              </div>

              {opportunity ? (
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Post Reference Data</span>
                    <button
                      onClick={handleCopyPrefill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Details
                        </>
                      )}
                    </button>
                  </div>
                  <div>
                    <span className="text-neutral-500">Position:</span>{' '}
                    <strong className="text-neutral-900">{opportunity.title}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Reference No:</span>{' '}
                    <strong className="text-emerald-700 bg-emerald-100/60 px-1 py-0.5 rounded">
                      {opportunity.referenceNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Department:</span> {opportunity.organization}
                  </div>
                  <div>
                    <span className="text-neutral-500">Location / Centre:</span> {opportunity.city},{' '}
                    {opportunity.province}
                  </div>
                  <div>
                    <span className="text-neutral-500">Closing Date:</span> {opportunity.closingDate}
                  </div>
                  {opportunity.handDeliveryAddress && (
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-neutral-500">Hand Delivery Depot:</span>{' '}
                      <p className="text-neutral-800 mt-0.5 font-sans">
                        {opportunity.handDeliveryAddress}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">Select any opportunity card to generate its custom Z83 details slip.</p>
              )}

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://www.dpsa.gov.za/dpsa2g/documents/vacancies/new%20z83%20form.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Official Blank Z83 PDF (Gov)
                </a>
                <a
                  href="https://www.dpsa.gov.za/vacancies"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Official DPSA Portal
                </a>
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-semibold text-sm text-neutral-900">
                Understanding the Revised New Z83 Form (DPSA Directive)
              </h4>
              <p>
                In terms of DPSA Circular 19 of 2022, only the <strong>New Z83 application form</strong> (effective since 1 January 2021) is legally accepted across all National and Provincial departments. Applications submitted on the old form will be <em>disqualified immediately</em> without being reviewed.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  No Certified Documents Needed Upfront:
                </div>
                <p>
                  Applicants are <strong>not required to submit certified copies</strong> of qualifications and identity documents during the initial application. Only a completed, signed Z83 and an up-to-date Curriculum Vitae (CV) must be submitted. Certified copies are requested only when shortlisted for an interview.
                </p>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-neutral-600">
                <li>Every question on the Z83 must be answered in full. Do not write &ldquo;refer to CV&rdquo;.</li>
                <li>The form must be initialed on page 1 and fully signed and dated on page 2.</li>
                <li>A separate Z83 form must be submitted for each individual post reference.</li>
              </ul>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Pre-Submission Verification (Check each item before posting or emailing)
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  {
                    title: 'Form Edition Verification',
                    desc: 'Look at the bottom left: ensure the form mentions "effective 01 Jan 2021". Old 2014 forms will be discarded.',
                  },
                  {
                    title: 'Exact Reference Number Quoted',
                    desc: 'Double check the reference number from the DPSA circular (e.g. DPSA/2026/CIRC-38-04).',
                  },
                  {
                    title: 'Section B (Declaration of Convictions & Dismissals)',
                    desc: 'Ensure all yes/no boxes in Section B are ticked. Leaving them blank is the #1 reason forms are disqualified.',
                  },
                  {
                    title: 'Signed and Dated by Hand or Digital ID',
                    desc: 'Undated or unsigned forms are invalid under the Public Service Regulations.',
                  },
                  {
                    title: 'Comprehensive CV Attached',
                    desc: 'Your CV must detail exact dates (Month/Year) of employment or schooling to verify minimum experience.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-neutral-900">{item.title}</span>
                      <p className="text-neutral-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>Compliant with DPSA Circular 19 of 2022</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
