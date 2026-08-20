import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Menu, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';

export const Header: React.FC = () => {
  const { 
    profile, 
    announcements, 
    selectedDate,
    markAnnouncementAsRead, 
    markAllAnnouncementsAsRead,
    setCurrentView,
    setIsMobileMenuOpen,
    setIsRightBriefDrawerOpen
  } = useAcademic();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [yr, mo, da] = selectedDate.split('-').map(Number);
  const formattedDateStr = new Date(Date.UTC(yr, (mo || 1) - 1, da || 1)).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };

    if (showNotificationsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationsDropdown]);

  const unreadAnnouncements = announcements.filter(a => !a.read);
  const unreadCount = unreadAnnouncements.length;

  return (
    <header className="bg-[#F8FAFC] px-4 sm:px-6 md:px-8 pt-5 pb-3 flex items-center justify-between gap-4 sticky top-0 z-50">
      {/* Greeting & Date + Mobile Menu Toggle */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile / Tablet hamburger button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              Academic Hub & Timetable
            </h1>
            <span className="text-base sm:text-xl shrink-0" role="img" aria-label="university">🏛️</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 truncate">
            {formattedDateStr} • IIT Patna M.Tech Portal
          </p>
        </div>
      </div>

      {/* Right Controls: daily brief, and notifications */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Today's Brief Button on Mobile & Tablet (< xl screens) */}
        <button
          onClick={() => setIsRightBriefDrawerOpen(true)}
          className="xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50/40 text-xs font-bold shadow-2xs transition-all"
          title="View today's academic schedule"
        >
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Daily Brief</span>
        </button>

        {/* Notifications Dropdown Button with outside-click detection container */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            id="btn-notifications-bell"
            onClick={() => setShowNotificationsDropdown(prev => !prev)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 shadow-xs transition-all relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Popup */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAnnouncementsAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {announcements.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No announcements available
                  </div>
                ) : (
                  announcements.slice(0, 6).map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => {
                        markAnnouncementAsRead(ann.id);
                        if (ann.actionUrl === '#assignments') setCurrentView('assignments');
                        else if (ann.actionUrl === '#recordings') setCurrentView('recordings');
                        else setCurrentView('notifications');
                        setShowNotificationsDropdown(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left flex gap-3 ${
                        !ann.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        ann.priority === 'urgent' ? 'bg-red-500' : ann.priority === 'normal' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${!ann.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'} truncate`}>
                            {ann.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{ann.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {ann.content}
                        </p>
                        {ann.author && (
                          <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                            By {ann.author}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setCurrentView('notifications');
                    setShowNotificationsDropdown(false);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold py-1 w-full"
                >
                  View all announcements & alerts →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
