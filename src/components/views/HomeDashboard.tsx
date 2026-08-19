import React, { useEffect, useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  FileText, 
  CheckSquare, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  Share2,
  CalendarPlus,
  Play,
  Sparkles,
  CheckCircle2,
  X,
  ListFilter
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { ClassSession } from '../../types';

export const HomeDashboard: React.FC = () => {
  const { 
    filteredClassSessions, 
    filteredAssignments, 
    filteredQuizzes, 
    filteredRecordings, 
    announcements, 
    recentUpdates, 
    selectedDate, 
    setSelectedDate,
    navigateDate,
    enrolledCourses,
    curriculumConfig,
    selectedElectiveIds,
    setIsElectiveModalOpen,
    setActiveMeetingModal,
    setActiveRecordingModal,
    setActiveAssignmentModal,
    setActiveQuizModal,
    toggleAssignmentCompleted,
    setCurrentView,
    showToast
  } = useAcademic();

  const [calendarViewMode, setCalendarViewMode] = useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isAcademicTrackDismissed, setIsAcademicTrackDismissed] = useState(false);

  // Next active class from student's enrolled courses based on selectedDate or upcoming status
  const nextClass = filteredClassSessions.find(s => s.date === selectedDate && s.status === 'upcoming')
    || filteredClassSessions.find(s => s.status === 'upcoming') 
    || filteredClassSessions.find(s => s.date === selectedDate)
    || filteredClassSessions[0];

  const [timeUntilNextClass, setTimeUntilNextClass] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      if (!nextClass) {
        setTimeUntilNextClass('');
        return;
      }
      const target = new Date(`${nextClass.date} ${nextClass.startTime}`);
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0) {
        setTimeUntilNextClass('Starting now');
        return;
      }
      const totalMinutes = Math.ceil(remaining / 60000);
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
      setTimeUntilNextClass(days > 0 ? `${days}d ${hours}h left` : hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`);
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 30000);
    return () => window.clearInterval(timer);
  }, [nextClass?.id, nextClass?.date, nextClass?.startTime]);

  // Today stats based on selectedDate
  const todayClassesCount = filteredClassSessions.filter(s => s.date === selectedDate).length;
  const todayAssignmentsCount = filteredAssignments.filter(a => a.dueDate === selectedDate).length;
  const todayQuizzesCount = filteredQuizzes.filter(q => q.date === selectedDate).length;
  const todayRecordingsCount = filteredRecordings.filter(r => r.date === selectedDate).length;

  // Dynamic Year/Month calculation for Selected Date
  const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
  const selYear = sYear || 2026;
  const selMonth = (sMonth ? sMonth - 1 : 7); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dynamic Month Calendar Generator
  const firstDayObj = new Date(Date.UTC(selYear, selMonth, 1));
  const dayOfWeekSun0 = firstDayObj.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const startingOffset = (dayOfWeekSun0 + 6) % 7; // Mon=0 ... Sun=6

  const totalDaysInMonth = new Date(Date.UTC(selYear, selMonth + 1, 0)).getUTCDate();
  const prevMonthTotalDays = new Date(Date.UTC(selYear, selMonth, 0)).getUTCDate();

  const prevDays = Array.from({ length: startingOffset }, (_, i) => {
    const dayNum = prevMonthTotalDays - startingOffset + 1 + i;
    const pMo = selMonth === 0 ? 11 : selMonth - 1;
    const pYr = selMonth === 0 ? selYear - 1 : selYear;
    const dateStr = `${pYr}-${(pMo + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return { day: dayNum, isCurrentMonth: false, dateStr };
  });

  const currentDays = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${selYear}-${(selMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return { day: dayNum, isCurrentMonth: true, dateStr };
  });

  const totalCells = Math.ceil((startingOffset + totalDaysInMonth) / 7) * 7;
  const nextDaysCount = totalCells - (startingOffset + totalDaysInMonth);
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => {
    const dayNum = i + 1;
    const nMo = selMonth === 11 ? 0 : selMonth + 1;
    const nYr = selMonth === 11 ? selYear + 1 : selYear;
    const dateStr = `${nYr}-${(nMo + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return { day: dayNum, isCurrentMonth: false, dateStr };
  });

  const baseCalendarDays = [...prevDays, ...currentDays, ...nextDays];

  const calendarCells = baseCalendarDays.map(cell => {
    const dots: string[] = [];
    const hasClass = filteredClassSessions.some(s => s.date === cell.dateStr);
    const hasAssign = filteredAssignments.some(a => a.dueDate === cell.dateStr);
    const hasQuiz = filteredQuizzes.some(q => q.date === cell.dateStr);
    const hasRec = filteredRecordings.some(r => r.date === cell.dateStr);
    const hasAnn = announcements.some(an => an.date === cell.dateStr && (!an.courseId || enrolledCourses.some(c => c.id === an.courseId)));

    if (hasClass) dots.push('class');
    if (hasAssign) dots.push('assign');
    if (hasQuiz) dots.push('quiz');
    if (hasRec) dots.push('rec');
    if (hasAnn) dots.push('ann');

    return {
      ...cell,
      dots,
    };
  });

  const getDotClass = (dotType: string) => {
    switch (dotType) {
      case 'class': return 'bg-blue-600';
      case 'assign': return 'bg-red-500';
      case 'quiz': return 'bg-orange-400';
      case 'rec': return 'bg-emerald-500';
      case 'ann': return 'bg-purple-600';
      default: return 'bg-slate-400';
    }
  };

  // Compute 7 days for Week View (Mon-Sun)
  const selDateObj = new Date(Date.UTC(selYear, selMonth, sDay || 1));
  const selDayOfWeekSun0 = selDateObj.getUTCDay();
  const selMonOffset = (selDayOfWeekSun0 + 6) % 7;
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dObj = new Date(selDateObj);
    dObj.setUTCDate(selDateObj.getUTCDate() - selMonOffset + i);
    const yStr = dObj.getUTCFullYear();
    const mStr = (dObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const dStr = dObj.getUTCDate().toString().padStart(2, '0');
    const dateStr = `${yStr}-${mStr}-${dStr}`;
    const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const dayNum = dObj.getUTCDate();
    const classes = filteredClassSessions.filter(s => s.date === dateStr);
    const assignments = filteredAssignments.filter(a => a.dueDate === dateStr);
    const quizzes = filteredQuizzes.filter(q => q.date === dateStr);
    return { dateStr, dayName, dayNum, classes, assignments, quizzes };
  });

  // Compute Agenda View items starting from selectedDate
  const agendaItems = [
    ...filteredClassSessions.map(s => ({ type: 'class' as const, date: s.date, time: s.startTime, title: `${s.courseCode}: ${s.courseName}`, session: s })),
    ...filteredAssignments.map(a => ({ type: 'assignment' as const, date: a.dueDate, time: a.dueTime, title: `Due: ${a.title}`, assignment: a })),
    ...filteredQuizzes.map(q => ({ type: 'quiz' as const, date: q.date, time: q.dueTime, title: `Quiz: ${q.title}`, quiz: q }))
  ].filter(item => item.date >= selectedDate).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Elective Summary Banner (Dismissible) */}
      {!isAcademicTrackDismissed && (
        <div className="p-4 bg-linear-to-r from-indigo-500/10 via-blue-500/10 to-transparent border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pr-8 sm:pr-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Your Academic Track: {enrolledCourses.length} Active Courses
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Portal is customized for your Core courses + chosen electives ({enrolledCourses.map(c => c.shortCode).join(', ')}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setIsElectiveModalOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 hover:text-indigo-800 font-bold text-xs rounded-xl shadow-2xs transition-all"
            >
              Change Electives
            </button>
            <button
              onClick={() => setIsAcademicTrackDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-colors"
              title="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Row: NEXT CLASS & TODAY OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* NEXT CLASS Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                Next Scheduled Lecture
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  {nextClass?.date === selectedDate ? 'Today Session' : nextClass?.date}
                </span>
                {timeUntilNextClass && <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Starts in {timeUntilNextClass}</span>}
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-600 mt-3">
              {nextClass?.startTime || '7:00 PM'} — {nextClass?.endTime || '9:00 PM'}
            </p>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {nextClass?.courseName || 'Technical Writing and Soft Skill'}
            </h3>

            <p className="text-sm text-slate-500 mt-1 font-medium">
              {nextClass?.lectureNumber || 'Lecture 05'} • {nextClass?.professor || 'Prof. S. Das'}
            </p>

            {/* Platform & Link Tag */}
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-600 flex-wrap">
              <div className="w-5 h-5 rounded-md bg-[#464EB8] text-white flex items-center justify-center font-bold text-[10px]">
                T
              </div>
              <span>Microsoft Teams • {nextClass?.courseCode}</span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                Permanent Link ({nextClass?.recurringSlot || 'Weekly Slot'})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              id="btn-join-next-class"
              onClick={() => nextClass && setActiveMeetingModal(nextClass)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/20 active:scale-[0.99]"
            >
              <Video className="w-4 h-4" />
              Join Lecture Room
            </button>

            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(prev => !prev)}
                className="w-11 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
                title="Options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showOptionsMenu && (
                <div className="absolute right-0 bottom-12 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      if (nextClass?.meetingUrl) navigator.clipboard.writeText(nextClass.meetingUrl);
                      showToast('Classroom link copied to clipboard!', 'success');
                      setShowOptionsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    Copy Meeting Link
                  </button>
                  <button
                    onClick={() => {
                      showToast('Added reminder to academic calendar', 'info');
                      setShowOptionsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-slate-400" />
                    Add Calendar Alert
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('courses');
                      setShowOptionsMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    View Course Syllabus
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TODAY OVERVIEW Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Schedule Overview ({selectedDate})
            </span>
            <button
              onClick={() => navigateDate('today')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Today
            </button>
          </div>

          <div className="space-y-4 my-auto py-2">
            {/* Classes */}
            <div 
              onClick={() => setCurrentView('calendar')}
              className="flex items-center justify-between cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  Live Classes Scheduled
                </span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {todayClassesCount}
              </span>
            </div>

            {/* Assignments */}
            <div 
              onClick={() => setCurrentView('assignments')}
              className="flex items-center justify-between cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                  Assignments Due
                </span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {todayAssignmentsCount}
              </span>
            </div>

            {/* Quizzes */}
            <div 
              onClick={() => setCurrentView('quizzes')}
              className="flex items-center justify-between cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                  Quizzes & Assessments
                </span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {todayQuizzesCount}
              </span>
            </div>

            {/* Recordings */}
            <div 
              onClick={() => setCurrentView('recordings')}
              className="flex items-center justify-between cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                  OneDrive Recordings
                </span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {todayRecordingsCount}
              </span>
            </div>
          </div>

          <div className="pt-2 text-center text-xs font-semibold text-slate-400">
            Customized for Student Workflow
          </div>
        </div>
      </div>

      {/* Middle Section: INTERACTIVE CALENDAR WIDGET */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {monthNames[selMonth]} {selYear}
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full">
              Selected: {selectedDate}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Today & Stepper Navigation Arrows */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70 shrink-0">
              <button
                onClick={() => navigateDate('today')}
                className="px-3 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all shadow-2xs"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate('prev')}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Tabs: Month, Week, Agenda */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
              {(['Month', 'Week', 'Agenda'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalendarViewMode(mode)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    calendarViewMode === mode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Switcher Output */}
        {calendarViewMode === 'Month' && (
          <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
            <div className="min-w-[300px]">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mt-4 text-center">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="text-[11px] font-extrabold text-slate-400 uppercase py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Day Grid */}
              <div className="grid grid-cols-7 gap-1.5 mt-1">
                {calendarCells.map((cell, idx) => {
                  const isSelected = selectedDate === cell.dateStr;
                  const hasDots = cell.dots && cell.dots.length > 0;

                  return (
                    <div
                      key={`${cell.dateStr}-${idx}`}
                      onClick={() => {
                        setSelectedDate(cell.dateStr);
                      }}
                      className={`calendar-grid-cell rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-between cursor-pointer border transition-all relative ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20 z-10'
                          : cell.isCurrentMonth
                          ? 'bg-slate-50/40 hover:bg-slate-100/80 border-transparent hover:border-slate-200 text-slate-800'
                          : 'bg-transparent border-transparent text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      {/* Day number */}
                      <span
                        className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : cell.isCurrentMonth
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {/* Event Category Dots */}
                      <div className="flex items-center gap-1 min-h-[6px] mt-1">
                        {hasDots && cell.dots!.map((dotType, dIdx) => (
                          <span
                            key={dIdx}
                            className={`w-1.5 h-1.5 rounded-full ${getDotClass(dotType)}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {calendarViewMode === 'Week' && (
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="grid grid-cols-7 gap-2 min-w-[600px]">
              {weekDays.map((wDay) => {
                const isSelected = selectedDate === wDay.dateStr;
                return (
                  <div
                    key={wDay.dateStr}
                    onClick={() => setSelectedDate(wDay.dateStr)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between min-h-[140px] ${
                      isSelected 
                        ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20' 
                        : 'bg-slate-50/50 hover:bg-slate-100 border-slate-100'
                    }`}
                  >
                    <div className="text-center pb-2 border-b border-slate-200/60">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">{wDay.dayName}</span>
                      <span className={`text-sm font-extrabold inline-block mt-0.5 px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-600 text-white' : 'text-slate-800'
                      }`}>
                        {wDay.dayNum}
                      </span>
                    </div>

                    <div className="space-y-1 mt-2 flex-1">
                      {wDay.classes.map(s => (
                        <div key={s.id} className="p-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold truncate">
                          {s.startTime} {s.courseCode}
                        </div>
                      ))}
                      {wDay.assignments.map(a => (
                        <div key={a.id} className="p-1 rounded bg-red-100 text-red-800 text-[10px] font-bold truncate">
                          Due: {a.courseCode}
                        </div>
                      ))}
                      {wDay.quizzes.map(q => (
                        <div key={q.id} className="p-1 rounded bg-orange-100 text-orange-800 text-[10px] font-bold truncate">
                          Quiz: {q.courseCode}
                        </div>
                      ))}
                      {wDay.classes.length === 0 && wDay.assignments.length === 0 && wDay.quizzes.length === 0 && (
                        <span className="text-[10px] text-slate-300 italic block text-center mt-3">No events</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {calendarViewMode === 'Agenda' && (
          <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {agendaItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">No upcoming items on agenda from selected date</p>
            ) : (
              agendaItems.slice(0, 8).map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    if (item.type === 'class') setActiveMeetingModal(item.session);
                    if (item.type === 'assignment') setActiveAssignmentModal(item.assignment);
                    if (item.type === 'quiz') setActiveQuizModal(item.quiz);
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      item.type === 'class' ? 'bg-blue-600' : item.type === 'assignment' ? 'bg-red-500' : 'bg-orange-400'
                    }`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.date} at {item.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 hover:underline">View →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Legend Bar below calendar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 pt-5 mt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Class</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span>Quiz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Recording</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>Announcement</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: UPCOMING DEADLINES & RECENT UPDATES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* UPCOMING DEADLINES */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Upcoming Coursework Deadlines
            </span>
            <button
              onClick={() => setCurrentView('assignments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5 pt-4">
            {filteredAssignments.slice(0, 3).map((assign) => (
              <div 
                key={assign.id}
                onClick={() => setActiveAssignmentModal(assign)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {assign.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Due {assign.dueDate} • {assign.courseName}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  assign.isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {assign.isCompleted ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT UPDATES */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Recent Updates & Activity
            </span>
            <button
              onClick={() => setCurrentView('notifications')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-4 pt-4">
            {recentUpdates.slice(0, 3).map((up) => (
              <div 
                key={up.id} 
                onClick={() => {
                  if (up.linkView) setCurrentView(up.linkView);
                }}
                className="flex items-start gap-3 p-1 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <span 
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0" 
                  style={{ backgroundColor: up.color }} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {up.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {up.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
