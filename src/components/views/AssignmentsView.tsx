import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Check, 
  Code2
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Assignment } from '../../types';
import { getTodayDateString } from '../../utils/date';

export const AssignmentsView: React.FC = () => {
  const { 
    filteredAssignments, 
    setActiveAssignmentModal 
  } = useAcademic();
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const todayStr = getTodayDateString();

  // Sort assignments: Active first, Completed at bottom
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const aDone = a.isCompleted ? 1 : 0;
    const bDone = b.isCompleted ? 1 : 0;
    if (aDone !== bDone) {
      return aDone - bDone;
    }
    return b.dueDate.localeCompare(a.dueDate);
  });

  const displayedAssignments = sortedAssignments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'done') return a.isCompleted;
    if (filter === 'active') return !a.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assignments & Coursework</h2>
          <p className="text-xs text-slate-500 mt-1">
            View upcoming problem sets, external coding challenges, and deadlines shared with students.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'To Do' },
            { id: 'done', label: '✓ Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedAssignments.map((assign) => {
          const isExpired = assign.dueDate < todayStr && !assign.isCompleted;
          const isCoding = assign.type === 'coding' || !!assign.externalUrl;

          return (
            <div
              key={assign.id}
              onClick={() => setActiveAssignmentModal(assign)}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between group relative cursor-pointer ${
                isExpired
                  ? 'bg-slate-100/70 border-slate-200 opacity-70'
                  : assign.isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : 'bg-white border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-50 text-blue-700">
                      {assign.courseCode}
                    </span>

                    {isCoding && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                        {assign.platformName || 'HackerRank'}
                      </span>
                    )}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    assign.isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isExpired
                      ? 'bg-slate-200 text-slate-600 border border-slate-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {assign.isCompleted ? 'Done' : isExpired ? 'Past Due' : `Due ${assign.dueDate}`}
                  </span>
                </div>

                <h3 
                  className={`text-base font-bold mt-3 group-hover:text-blue-600 transition-colors ${
                    assign.isCompleted ? 'line-through text-slate-500' : isExpired ? 'text-slate-600' : 'text-slate-900'
                  }`}
                >
                  {assign.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {assign.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  Due: <strong className="text-slate-700">{assign.dueDate}</strong> ({assign.dueTime})
                </span>
                <span className="text-blue-600 font-semibold text-[11px] group-hover:underline">
                  View details →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
