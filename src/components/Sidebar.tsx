import React from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Video, 
  Bell, 
  Settings, 
  ShieldCheck, 
  GraduationCap,
  X,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    enrolledCourses, 
    announcements, 
    profile, 
    isAdminMode, 
    setIsAdminMode,
    setSelectedCourseFilter,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsElectiveModalOpen,
    selectedElectiveIds,
    curriculumConfig
  } = useAcademic();

  const unreadCount = announcements.filter(a => !a.read).length;
  const canManage = profile.role === 'admin' || profile.role === 'sub_admin';

  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: CheckSquare },
    { id: 'recordings', label: 'Recordings', icon: Video },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    setSelectedCourseFilter(null);
    setIsMobileMenuOpen(false);
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseFilter(courseId);
    setCurrentView('courses');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Sidebar Container: Fixed on Desktop (lg+), Drawer on Mobile/Tablet */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:static lg:z-20
        w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen select-none shrink-0 transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Brand & Navigation */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between mb-6">
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Academe</span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Only server-authorized administrators receive management navigation. */}
          {canManage && <div className="mb-5">
            <button
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false);
                  setCurrentView('home');
                } else {
                  setIsAdminMode(true);
                  setCurrentView('admin');
                }
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${
                isAdminMode 
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${isAdminMode ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{isAdminMode ? 'Admin Portal Active' : 'Faculty / Admin Mode'}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isAdminMode ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {isAdminMode ? 'ON' : 'SWITCH'}
              </span>
            </button>
          </div>}

          {/* Main Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id && !isAdminMode;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dedicated Admin view button */}
            {canManage && <button
              id="nav-item-admin"
              onClick={() => {
                setIsAdminMode(true);
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'admin' && isAdminMode
                  ? 'bg-amber-100/70 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className={`w-4 h-4 ${currentView === 'admin' ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>Admin Management</span>
              </div>
            </button>}
          </nav>

          {/* MY ENROLLED COURSES Section (Core + Chosen Electives) */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3.5 mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                My Enrolled Courses ({enrolledCourses.length})
              </span>
              <button
                onClick={() => setIsElectiveModalOpen(true)}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
                title="Manage electives"
              >
                Electives
              </button>
            </div>

            <div className="space-y-0.5">
              {enrolledCourses.map((course) => (
                <button
                  key={course.id}
                  id={`sidebar-course-${course.id}`}
                  onClick={() => handleCourseClick(course.id)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span 
                      className="font-bold text-[10px] px-1.5 py-0.5 rounded tracking-tight shrink-0"
                      style={{
                        backgroundColor: `${course.color}15`,
                        color: course.color,
                      }}
                    >
                      {course.shortCode}
                    </span>
                    <span className="truncate group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1 rounded ${
                    course.courseType === 'core' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {course.courseType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">
                {profile.name}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {profile.studentId}
              </div>
            </div>
          </div>

          <button
            id="btn-sidebar-settings"
            onClick={() => handleNavClick('settings')}
            className={`mt-2 w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'settings' 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </div>
            <span className="text-slate-400 text-xs font-semibold">›</span>
          </button>
        </div>
      </aside>
    </>
  );
};
