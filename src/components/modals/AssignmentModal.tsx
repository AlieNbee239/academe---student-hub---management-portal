import React from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Check,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { getTodayDateString } from '../../utils/date';

export const AssignmentModal: React.FC = () => {
  const { 
    activeAssignmentModal, 
    setActiveAssignmentModal, 
    toggleAssignmentCompleted 
  } = useAcademic();

  const assign = activeAssignmentModal;
  const todayStr = getTodayDateString();
  const isExpired = assign ? assign.dueDate < todayStr && !assign.isCompleted : false;

  if (!assign) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {assign.courseCode}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {assign.courseName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {assign.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveAssignmentModal(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Due date & status bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Deadline: <strong className="text-slate-900">{assign.dueDate} at {assign.dueTime}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleAssignmentCompleted(assign.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  assign.isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${assign.isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                {assign.isCompleted ? 'Completed' : 'Mark as Done'}
              </button>
            </div>
          </div>

          {/* External Platform Challenge / Portal Link (e.g. HackerRank, Colab, Drive) */}
          {(assign.externalUrl || assign.instructions) && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  {assign.platformName || 'Assignment Link & Instructions'}
                </span>
              </div>

              {assign.instructions && (
                <div className="p-3 bg-white rounded-xl text-xs text-slate-700 leading-relaxed border border-blue-100/60">
                  <strong className="text-slate-900 block mb-1">Details & Instructions:</strong>
                  {assign.instructions}
                </div>
              )}

              {assign.externalUrl && (
                <div className="pt-1 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 font-medium">
                    Open problem statement or external platform:
                  </span>
                  <a
                    href={assign.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <span>Open {assign.platformName || 'Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Overview & Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Assignment Overview
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs leading-relaxed text-slate-700">
              {assign.description}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Click outside or press Close to dismiss
          </span>
          <button
            onClick={() => setActiveAssignmentModal(null)}
            className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
