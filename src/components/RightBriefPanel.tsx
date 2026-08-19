import React from 'react';
import { 
  Video, 
  FileText, 
  CheckSquare, 
  Play, 
  Megaphone, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { ClassSession } from '../types';

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
    filteredRecordings, 
    announcements,
    setActiveMeetingModal,
    setActiveRecordingModal,
    setActiveAssignmentModal,
    setActiveQuizModal,
    toggleAssignmentCompleted,
    setCurrentView
  } = useAcademic();

  // Format date details
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  const dayNumber = dateObj.getUTCDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

  // Filter items for selected day
  const dayClasses = filteredClassSessions.filter(s => s.date === selectedDate);
  const dayAssignments = filteredAssignments.filter(a => a.dueDate === selectedDate);
  const dayQuizzes = filteredQuizzes.filter(q => q.date === selectedDate);
  const dayRecordings = filteredRecordings.filter(r => r.date === selectedDate);
  const dayAnnouncements = announcements.filter(a => a.date === selectedDate);

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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {weekdayName}
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
                  className="flex items-start justify-between gap-3 group text-left"
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
                        {session.lectureNumber} • {session.professor} {session.recurringSlot && `• (${session.recurringSlot})`}
                      </p>
                    </div>
                  </div>

                  {session.status === 'completed' && session.hasRecording ? (
                    <button
                      onClick={() => {
                        const rec = filteredRecordings.find(r => r.courseId === session.courseId) || filteredRecordings[0];
                        if (rec) window.open(rec.oneDriveUrl, '_blank', 'noopener,noreferrer');
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 shrink-0 border border-emerald-200 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-emerald-600" />
                      Recording
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClick(session)}
                      className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold flex items-center gap-1.5 shrink-0 border border-blue-200 hover:border-blue-600 transition-all shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ASSIGNMENTS */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Assignments
            </span>
            <button 
              onClick={() => {
                setCurrentView('assignments');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              All
            </button>
          </div>

          {dayAssignments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No assignments due on this date</p>
          ) : (
            <div className="space-y-2">
              {dayAssignments.map((assign) => (
                <div
                  key={assign.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => toggleAssignmentCompleted(assign.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        assign.isCompleted 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                      title="Toggle done"
                    >
                      {assign.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${assign.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {assign.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        Due today • {assign.dueTime} {assign.selfScore !== undefined && `• Score: ${assign.selfScore}/${assign.totalPoints}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAssignmentModal(assign);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all shrink-0 ml-2"
                  >
                    {assign.isCompleted ? (assign.selfScore !== undefined ? `${assign.selfScore} pts` : 'Done') : 'Open'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUIZZES */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Quizzes
            </span>
            <button 
              onClick={() => {
                setCurrentView('quizzes');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              All
            </button>
          </div>

          {dayQuizzes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No quizzes scheduled today</p>
          ) : (
            <div className="space-y-2">
              {dayQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {quiz.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        Due today • {quiz.dueTime}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveQuizModal(quiz);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 shadow-2xs transition-all shrink-0 ml-2"
                  >
                    {quiz.status === 'completed' ? `Score: ${quiz.score}` : 'Open'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECORDINGS */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Recordings
            </span>
            <button 
              onClick={() => {
                setCurrentView('recordings');
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-blue-600 hover:underline font-semibold"
            >
              OneDrive Library
            </button>
          </div>

          {dayRecordings.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No recordings published today</p>
          ) : (
            <div className="space-y-2">
              {dayRecordings.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {rec.lectureTitle}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {rec.duration} • Available
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.open(rec.oneDriveUrl, '_blank', 'noopener,noreferrer');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-2xs transition-all shrink-0 ml-2"
                  >
                    Watch
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase block mb-3">
            Announcements
          </span>

          {dayAnnouncements.length === 0 ? (
            <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
              <Megaphone className="w-4 h-4 text-purple-400 shrink-0" />
              <span>No announcements for today</span>
            </div>
          ) : (
            <div className="space-y-2">
              {dayAnnouncements.map((ann) => (
                <div 
                  key={ann.id} 
                  className={`p-3 rounded-xl border text-xs ${
                    ann.priority === 'urgent' 
                      ? 'bg-red-50/80 border-red-200 text-red-900' 
                      : 'bg-purple-50/70 border-purple-200 text-purple-900'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center justify-between">
                    <span>{ann.title}</span>
                    <span className="text-[10px] opacity-75">{ann.time}</span>
                  </div>
                  <p className="text-[11px] opacity-90">{ann.content}</p>
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
