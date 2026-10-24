import React, { useState } from 'react';
import { FileText, Copy, Check, Download, X, Plus, Trash2 } from 'lucide-react';

interface CVBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVBuilderModal: React.FC<CVBuilderModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('Sipho Ndlovu');
  const [idNumber, setIdNumber] = useState('020415 5123 084');
  const [phone, setPhone] = useState('072 555 1234');
  const [email, setEmail] = useState('sipho.ndlovu@gmail.com');
  const [location, setLocation] = useState('Soweto, Johannesburg, Gauteng');
  const [highestQual, setHighestQual] = useState('National Diploma in Information Technology');
  const [matricSchool, setMatricSchool] = useState('Orlando High School (Class of 2021)');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedCV = `CURRICULUM VITAE

PERSONAL DETAILS
----------------
Full Name: ${fullName}
Identity Number: ${idNumber}
Contact Number: ${phone}
Email Address: ${email}
Residential Address: ${location}
Nationality: South African Citizen
Criminal Record: None
Driver’s Licence: Code 08 (B) - Valid

CAREER OBJECTIVE
----------------
Dedicated and detail-oriented young South African professional seeking an entry-level or developmental opportunity where I can apply my skills, contribute meaningfully to organizational objectives, and grow into a specialist role.

EDUCATION & QUALIFICATIONS
--------------------------
1. Tertiary Education
   Qualification: ${highestQual}
   Institution: University of Johannesburg / TVET
   Status: Completed

2. Secondary Education
   School: ${matricSchool}
   Matric Certificate (National Senior Certificate - NSC)
   Subjects: English (Home Lang), Mathematics / Math Lit, Physical Science / Business Studies, Life Orientation

PRACTICAL SKILLS
----------------
- Computer Literacy: Microsoft Office (Word, Excel, PowerPoint, Outlook)
- Communication: Fluent in English and isiZulu (Written & Verbal)
- Time management, problem-solving, and professional telephone etiquette
- Adherence to workplace safety regulations and confidentiality protocols

REFERENCES
----------
1. Academic / Departmental HOD
   Name: Dr. M. Dlamini
   Institution: Faculty of Applied Sciences
   Contact: 011 559 2000

2. Previous Supervisor / Teacher
   Name: Mrs. T. Khumalo
   Role: Department Head
   Contact: 082 123 4567`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCV], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.replace(/\s+/g, '_')}_CV_Standard_SA.txt`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-[#00674F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                South African Standard CV Builder
              </h3>
              <p className="text-xs text-white/80">
                Optimized for government circulars, Z83 submissions, SETA learnerships, and corporate portals
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Full Names</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                South African ID / Smart Card Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-neutral-800 mb-1">
                Residential Location (Township/Suburban, City, Province)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={highestQual}
                onChange={(e) => setHighestQual(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                High School / Matric Details
              </label>
              <input
                type="text"
                value={matricSchool}
                onChange={(e) => setMatricSchool(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
          </div>

          {/* Formatted Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-800">Generated Standard CV Format</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy CV Text'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-[#00674F] hover:bg-[#00503D] text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              rows={8}
              value={generatedCV}
              className="w-full p-3 font-mono text-[11px] bg-neutral-50 border border-neutral-300 rounded-xl leading-relaxed text-neutral-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
