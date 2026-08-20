import React from 'react';
import { X, Check, BookOpen, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const ElectiveSelectionModal: React.FC = () => {
  const { 
    courses, 
    curriculumConfig, 
    selectedElectiveIds, 
    toggleElective, 
    isElectiveModalOpen, 
    setIsElectiveModalOpen 
  } = useAcademic();

  if (!isElectiveModalOpen) return null;

  const electiveCourses = courses.filter(c => c.courseType === 'elective');
  const coreCourses = courses.filter(c => c.courseType === 'core');
  const selectedCount = selectedElectiveIds.length;
  const maxAllowed = curriculumConfig.maxElectivesAllowed;

  const handleSaveElectives = () => {
    localStorage.setItem('academe_electives_saved', 'true');
    setIsElectiveModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Curriculum Choice
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedCount === maxAllowed 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {selectedCount} of {maxAllowed} Electives Chosen
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Customize Your Semester Electives
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsElectiveModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational banner */}
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-800 flex items-start gap-2.5 shrink-0">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            Your calendar, assignments, quizzes, and recordings will automatically filter to show your 
            <strong> {coreCourses.length} Core Subjects</strong> + 
            <strong> {selectedCount} Selected Electives</strong>.
          </p>
        </div>

        {/* Elective Selection List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Available Elective Offerings
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              Limit: Max {maxAllowed}
            </span>
          </div>

          {electiveCourses.map((course) => {
            const isSelected = selectedElectiveIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => toggleElective(course.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected 
                    ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                    style={{ backgroundColor: `${course.color}15`, color: course.color }}
                  >
                    {course.shortCode}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {course.name}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {course.credits} Credits
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.syllabus}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Faculty: {course.professor}</span>
                      <span>•</span>
                      <span>{course.room}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-1 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : 'border-2 border-slate-300 text-transparent hover:border-indigo-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Compulsory Core info */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Compulsory Core: {coreCourses.map(c => c.shortCode).join(', ')} (Enrolled by default)
          </div>

          <button
            onClick={handleSaveElectives}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/20 transition-all"
          >
            Save & Update My Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
