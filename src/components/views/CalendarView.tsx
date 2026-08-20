import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  FileText, 
  Clock, 
  Filter, 
  Download, 
  Sparkles, 
  AlertCircle, 
  Check, 
  HelpCircle
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { getTodayDateString, getYesterdayDateString } from '../../utils/date';

export const CalendarView: React.FC = () => {
  const { 
    filteredClassSessions, 
    filteredAssignments, 
    filteredQuizzes, 
    holidays,
    isHoliday,
    selectedDate, 
    setSelectedDate, 
    navigateDate,
    setActiveMeetingModal,
    setActiveAssignmentModal,
    setActiveQuizModal,
    showToast
  } = useAcademic();

  const [activeFilter, setActiveFilter] = useState<'all' | 'class' | 'assignment' | 'quiz' | 'holiday'>('all');
  
  // Year & Month state initialized to August 2026 (or selected date)
  const initialDateParts = selectedDate.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(initialDateParts[0] || 2026);
  const [viewMonth, setViewMonth] = useState<number>((initialDateParts[1] ? initialDateParts[1] - 1 : 7)); // 0-indexed (7 = Aug)

  // Keep viewMonth synced if selectedDate jumps to another month
  useEffect(() => {
    const parts = selectedDate.split('-').map(Number);
    if (parts.length === 3) {
      const yr = parts[0];
      const mo = parts[1] - 1;
      if (yr !== viewYear || mo !== viewMonth) {
        setViewYear(yr);
        setViewMonth(mo);
      }
    }
  }, [selectedDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = getTodayDateString();
    const [year, month] = today.split('-').map(Number);
    setViewYear(year);
    setViewMonth(month - 1);
    setSelectedDate(today);
    showToast(`Jumped to Today (${today})`, 'info');
  };

  // Calendar Calculation for Month Grid
  const firstDayObj = new Date(Date.UTC(viewYear, viewMonth, 1));
  const dayOfWeekSun0 = firstDayObj.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const startingOffset = (dayOfWeekSun0 + 6) % 7; // Mon=0 ... Sun=6

  const totalDaysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const prevMonthTotalDays = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

  // 1. Leading days from previous month
  const prevDays = Array.from({ length: startingOffset }, (_, i) => {
    const dayNum = prevMonthTotalDays - startingOffset + 1 + i;
    return { day: dayNum, isCurrentMonth: false };
  });

  // 2. Days in Current Month
  const currentDays = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    const holiday = isHoliday(dateStr);
    const hasHoliday = !!holiday;

    // Requirement: In holidays NO classes are shown
    const rawClasses = filteredClassSessions.filter(s => s.date === dateStr);
    const classes = hasHoliday ? [] : rawClasses;

    const assignments = filteredAssignments.filter(a => a.dueDate === dateStr);
    const quizzes = filteredQuizzes.filter(q => q.date === dateStr);

    return {
      day: dayNum,
      dateStr,
      isCurrentMonth: true,
      isHoliday: hasHoliday,
      holiday,
      classes,
      assignments,
      quizzes,
      totalEvents: classes.length + assignments.length + quizzes.length + (hasHoliday ? 1 : 0),
    };
  });

  // 3. Trailing days for next month
  const totalCells = Math.ceil((startingOffset + totalDaysInMonth) / 7) * 7;
  const nextDaysCount = totalCells - (startingOffset + totalDaysInMonth);
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false
  }));

  // Find data for currently selected date
  const selectedHoliday = isHoliday(selectedDate);
  const rawSelectedClasses = filteredClassSessions.filter(s => s.date === selectedDate);
  const selectedClasses = selectedHoliday ? [] : rawSelectedClasses;
  const selectedAssignments = filteredAssignments.filter(a => a.dueDate === selectedDate);
  const selectedQuizzes = filteredQuizzes.filter(q => q.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Top Header & Month Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Schedule</h2>
            <div className="flex items-center bg-blue-50 text-blue-800 font-extrabold text-xs px-3 py-1 rounded-full border border-blue-100">
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              {monthNames[viewMonth]} {viewYear}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live lectures (Teams/Meet), assignment due dates, quizzes, and official institute holidays.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Stepper Navigator */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-extrabold text-slate-800 px-2 select-none min-w-[110px] text-center">
              {monthNames[viewMonth].slice(0, 3)} {viewYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleJumpToToday}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl transition-colors shadow-2xs"
          >
            Today
          </button>

          <button
            onClick={() => showToast('Calendar exported as .ics format', 'success')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export iCal
          </button>
        </div>
      </div>

      {/* Filter Chips (Recordings removed as requested) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {[
          { id: 'all', label: 'All Schedule', color: 'bg-slate-900 text-white' },
          { id: 'class', label: '🔵 Classes (Teams/Meet)' },
          { id: 'assignment', label: '🔴 Assignments Due' },
          { id: 'quiz', label: '🟠 Quizzes' },
          { id: 'holiday', label: '🏖️ Holidays' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Grid & Day Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[540px]">
              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-extrabold text-slate-400 uppercase pb-2 border-b border-slate-100">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-2 mt-3">
                {/* Previous month leading days */}
                {prevDays.map((p, idx) => (
                  <div 
                    key={`prev-${idx}`} 
                    className="p-2 min-h-[85px] rounded-2xl bg-slate-50/40 opacity-30 text-slate-400 text-xs font-semibold text-center select-none"
                  >
                    {p.day}
                  </div>
                ))}

                {/* Current month days */}
                {currentDays.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  const isHolidayDay = d.isHoliday;

                  return (
                    <div
                      key={d.dateStr}
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-2 min-h-[92px] rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : isHolidayDay
                          ? 'bg-amber-50/40 hover:bg-amber-50/80 border-amber-200/80 text-amber-900'
                          : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isHolidayDay 
                            ? 'bg-amber-200 text-amber-900' 
                            : 'text-slate-700'
                        }`}>
                          {d.day}
                        </span>

                        {d.totalEvents > 0 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            {d.totalEvents}
                          </span>
                        )}
                      </div>

                      {/* Event indicators */}
                      <div className="space-y-1 mt-1">
                        {/* Holiday Badge */}
                        {isHolidayDay && (activeFilter === 'all' || activeFilter === 'holiday') && (
                          <div className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[9px] font-bold truncate" title={d.holiday?.name}>
                            🏖️ {d.holiday?.name}
                          </div>
                        )}

                        {/* Live Classes (Hidden if Holiday) */}
                        {!isHolidayDay && d.classes.length > 0 && (activeFilter === 'all' || activeFilter === 'class') && (
                          <div className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold truncate">
                            {d.classes.length > 1 ? `${d.classes.length} Classes` : d.classes[0].courseCode}
                          </div>
                        )}

                        {/* Assignments Due */}
                        {d.assignments.length > 0 && (activeFilter === 'all' || activeFilter === 'assignment') && (
                          <div className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold truncate">
                            Due: {d.assignments[0].courseCode}
                          </div>
                        )}

                        {/* Quizzes */}
                        {d.quizzes.length > 0 && (activeFilter === 'all' || activeFilter === 'quiz') && (
                          <div className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-bold truncate">
                            Quiz: {d.quizzes[0].courseCode}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Next month trailing days */}
                {nextDays.map((n, idx) => (
                  <div 
                    key={`next-${idx}`} 
                    className="p-2 min-h-[85px] rounded-2xl bg-slate-50/40 opacity-30 text-slate-400 text-xs font-semibold text-center select-none"
                  >
                    {n.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda Detail (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Selected Day {selectedDate === getYesterdayDateString() && (
                    <span className="text-red-600 font-extrabold uppercase ml-1.5">• Yesterday</span>
                  )}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>{selectedDate}</span>
                  {selectedDate === getYesterdayDateString() && (
                    <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Yesterday
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Holiday Notice (if any) */}
              {selectedHoliday && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏖️</span>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Holiday: {selectedHoliday.name}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {selectedHoliday.description || 'Institute Holiday • All classes and academic lectures suspended.'}
                  </p>
                  <div className="text-[11px] font-semibold text-amber-700 pt-1">
                    ✓ No classes will be conducted on this day.
                  </div>
                </div>
              )}

              {/* Scheduled Classes (None on holidays) */}
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Classes ({selectedClasses.length})
                </span>

                {selectedHoliday ? (
                  <p className="text-xs text-amber-700/80 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    No classes on this day (Holiday)
                  </p>
                ) : selectedClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No scheduled lectures for this day</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClasses.map(s => (
                      <div key={s.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              {s.courseCode}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate">{s.courseName}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 truncate">
                            {s.startTime} - {s.endTime} • {s.professor}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveMeetingModal(s)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs shrink-0 transition-colors"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignments Due */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Assignments Due ({selectedAssignments.length})
                </span>
                {selectedAssignments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No assignments due on this date</p>
                ) : (
                  <div className="space-y-2">
                    {selectedAssignments.map(a => (
                      <div key={a.id} className="p-3 rounded-2xl bg-red-50/40 border border-red-200/60 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{a.title}</h4>
                          <p className="text-[11px] text-slate-500">Due at {a.dueTime}</p>
                        </div>
                        <button
                          onClick={() => setActiveAssignmentModal(a)}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-xs font-bold rounded-xl hover:border-blue-500 shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quizzes */}
              {selectedQuizzes.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Quizzes & Knowledge Checks ({selectedQuizzes.length})
                  </span>
                  <div className="space-y-2">
                    {selectedQuizzes.map(q => (
                      <div key={q.id} className="p-3 rounded-2xl bg-orange-50/40 border border-orange-200/60 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{q.title}</h4>
                          <p className="text-[11px] text-slate-500">Due {q.dueTime} • {q.durationMinutes}m</p>
                        </div>
                        <button
                          onClick={() => setActiveQuizModal(q)}
                          className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shrink-0"
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">
              Timetable synced with official batch curriculum
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
