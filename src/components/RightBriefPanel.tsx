import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  CheckSquare, 
  X, 
  CheckCircle2, 
  Play,
  AlertCircle
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { ClassSession } from '../types';
import { getYesterdayDateString, getTodayDateString } from '../utils/date';

interface RightBriefContentProps {
  onCloseMobile?: () => void;
}

const RightBriefContent: React.FC<RightBriefContentProps> = ({ onCloseMobile }) => {
  const { 
    selectedDate, 
    navigateDate,
    filteredClassSessions, 
    filteredAssignments, 
    filteredQuizzes, 
    setActiveMeetingModal,
    setActiveAssignmentModal,
    setActiveQuizModal,
    toggleAssignmentCompleted,
    setCurrentView
  } = useAcademic();

  const yesterdayStr = getYesterdayDateString();
  const todayStr = getTodayDateString();
  const isYesterday = selectedDate === yesterdayStr;
  const isToday = selectedDate === todayStr;

  // Format date details
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  const dayNumber = dateObj.getUTCDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

  // Filter classes for selected day
  const dayClasses = filteredClassSessions.filter(s => s.date === selectedDate);

  // Active / Running Assignments (all upcoming or pending assignments)
  const runningAssignments = filteredAssignments
    .filter(a => !a.isCompleted || a.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.dueTime.localeCompare(b.dueTime));

  // Active / Running Quizzes (all upcoming or active quizzes)
  const runningQuizzes = filteredQuizzes
    .filter(q => q.date >= todayStr || q.status === 'live' || q.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date) || a.dueTime.localeCompare(b.dueTime));

  const handleJoinClick = (session: ClassSession) => {
    setActiveMeetingModal(session);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date Header with Stepper Controls (Prev / Next Date Navigation) */}
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {dayNumber} {monthName}
          </h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
            <span>{weekdayName}</span>
            {isYesterday && (
              <span className="text-red-600 font-extrabold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[10px]">
                Yesterday
              </span>
            )}
            {isToday && (
              <span className="text-blue-600 font-extrabold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-[10px]">
                Today
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Stepper controls */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateDate('today')}
              className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-2xs"
              title="Jump to today"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              title="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Close button on Mobile/Tablet */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="xl:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close daily brief"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-5 flex-1 overflow-y-auto pr-1">
        {/* TODAY'S ACADEMIC BRIEF */}
        <div>
          <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase block mb-3">
            Today's Academic Brief
          </span>

          {dayClasses.length === 0 ? (
            <div className="text-xs text-slate-400 py-3 bg-slate-50 rounded-xl text-center px-3 border border-slate-100">
              No live classes scheduled for this date
            </div>
          ) : (
            <div className="space-y-3">
              {dayClasses.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-start justify-between gap-3 group text-left p-2.5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {session.startTime}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {session.courseName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {session.lectureNumber} • {session.professor}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinClick(session)}
                    className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold flex items-center gap-1.5 shrink-0 border border-blue-200 hover:border-blue-600 transition-all shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RUNNING ASSIGNMENTS */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                Active Assignments
              </span>
              <span className="text-[10px] font-bold bg-red-50 text-red-700 px-1.5 py-0.2 rounded-full border border-red-100">
                {runningAssignments.length}
              </span>
            </div>
            <button 
              onClick={() => {
                setCurrentView('assignments');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          {runningAssignments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No active assignments running</p>
          ) : (
            <div className="space-y-2.5">
              {runningAssignments.slice(0, 5).map((assign) => (
                <div
                  key={assign.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => toggleAssignmentCompleted(assign.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        assign.isCompleted 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                      title="Toggle complete"
                    >
                      {assign.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${assign.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {assign.title}
                      </h4>
                      <p className="text-[10px] text-red-600 font-bold truncate mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span>Due: {assign.dueDate === todayStr ? 'Today' : assign.dueDate} • {assign.dueTime}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAssignmentModal(assign);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all shrink-0 ml-2"
                  >
                    {assign.isCompleted ? 'Done' : 'Open'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RUNNING QUIZZES */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                Active Quizzes
              </span>
              <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-1.5 py-0.2 rounded-full border border-orange-100">
                {runningQuizzes.length}
              </span>
            </div>
            <button 
              onClick={() => {
                setCurrentView('quizzes');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          {runningQuizzes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No upcoming quizzes scheduled</p>
          ) : (
            <div className="space-y-2.5">
              {runningQuizzes.slice(0, 5).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {quiz.title}
                      </h4>
                      <p className="text-[10px] text-orange-600 font-bold truncate mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>Date: {quiz.date === todayStr ? 'Today' : quiz.date} • {quiz.dueTime}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveQuizModal(quiz);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 shadow-2xs transition-all shrink-0 ml-2"
                  >
                    {quiz.status === 'completed' ? `Score: ${quiz.score}` : 'Open'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RightBriefPanel: React.FC = () => {
  const { isRightBriefDrawerOpen, setIsRightBriefDrawerOpen } = useAcademic();

  return (
    <>
      {/* 1. Desktop Fixed Right Panel (Visible on xl screens and above >= 1280px) */}
      <aside className="hidden xl:flex w-80 2xl:w-88 bg-white border-l border-slate-100 p-6 flex-col h-screen sticky top-0 overflow-y-auto shrink-0 select-none">
        <RightBriefContent />
      </aside>

      {/* 2. Mobile & Tablet Drawer Modal (Visible on < xl screens when toggled) */}
      {isRightBriefDrawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsRightBriefDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
          />

          {/* Slide-over Drawer Panel */}
          <aside className="relative w-full max-w-sm sm:max-w-md bg-white p-6 h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            <RightBriefContent onCloseMobile={() => setIsRightBriefDrawerOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
};
