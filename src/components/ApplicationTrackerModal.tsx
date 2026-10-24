import React, { useState } from 'react';
import { Opportunity } from '../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Calendar,
  X,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';

export interface TrackedApplication {
  id: string;
  opportunityId?: string;
  title: string;
  organization: string;
  status: 'Saved' | 'Z83 Prepared' | 'Applied' | 'Interview Scheduled' | 'Shortlisted' | 'Offered';
  deadline: string;
  appliedDate: string;
  referenceNo: string;
  notes: string;
}

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: TrackedApplication[];
  onUpdateStatus: (id: string, status: TrackedApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (app: Omit<TrackedApplication, 'id'>) => void;
  onOpenZ83: (opp?: any) => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onAddApplication,
  onOpenZ83,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [status, setStatus] = useState<TrackedApplication['status']>('Applied');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization) return;

    onAddApplication({
      title,
      organization,
      referenceNo: referenceNo || 'N/A',
      deadline,
      appliedDate: '2026-10-24',
      status,
      notes,
    });

    setTitle('');
    setOrganization('');
    setReferenceNo('');
    setNotes('');
    setShowAddForm(false);
  };

  const statusColors: Record<TrackedApplication['status'], string> = {
    Saved: 'bg-neutral-100 text-neutral-700',
    'Z83 Prepared': 'bg-blue-100 text-blue-800',
    Applied: 'bg-amber-100 text-amber-800',
    'Interview Scheduled': 'bg-purple-100 text-purple-800',
    Shortlisted: 'bg-emerald-100 text-emerald-800',
    Offered: 'bg-green-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-[#00674F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Application Tracker</h3>
              <p className="text-xs text-white/80">
                Monitor deadlines, interview invitations & Z83 submission receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-[#00674F] rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track New Application</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Form Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="p-5 bg-neutral-50 border-b border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          >
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Position Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Administrative Officer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Employer / Department
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Department of Health"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Reference No.</label>
              <input
                type="text"
                placeholder="e.g. DOH/2026/08"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Closing Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              >
                <option value="Saved">Saved</option>
                <option value="Z83 Prepared">Z83 Prepared</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offered</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Notes / Tracking ID</label>
              <input
                type="text"
                placeholder="e.g. Registered mail tracking # or email"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00674F]"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#00674F] hover:bg-[#00503D] text-white rounded-lg font-semibold"
              >
                Save Application
              </button>
            </div>
          </form>
        )}

        {/* Applications List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {applications.length > 0 ? (
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100/75 border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3.5">Position & Department</th>
                    <th className="py-2.5 px-3">Reference No</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3">Current Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-neutral-900">{app.title}</div>
                        <div className="text-neutral-500 text-[11px]">{app.organization}</div>
                        {app.notes && (
                          <div className="text-[11px] text-neutral-400 mt-0.5 italic">
                            {app.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-700">{app.referenceNo}</td>
                      <td className="py-3 px-3 font-mono text-neutral-600">{app.deadline}</td>
                      <td className="py-3 px-3">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                          className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer border-0 ${statusColors[app.status]}`}
                        >
                          <option value="Saved">Saved</option>
                          <option value="Z83 Prepared">Z83 Prepared</option>
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offered">Offered</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                          title="Remove application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-500 space-y-2">
              <ClipboardList className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="font-semibold text-neutral-700">No applications tracked yet</div>
              <p className="text-xs">
                Track your active job, learnership, or bursary applications to never miss a closing date or interview invitation.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>{applications.length} applications currently being monitored</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
