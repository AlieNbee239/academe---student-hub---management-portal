import React from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Video, 
  Bell, 
  ShieldCheck, 
  GraduationCap,
  X,
  Info
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
    { id: 'about', label: 'About', icon: Info },
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
          </nav>

          {/* MY ENROLLED COURSES Section (Core + Chosen Electives) */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3.5 mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Enrolled Courses ({enrolledCourses.length})
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

        {/* Bottom Institutional Info & Admin Access */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold">IIT Patna System Live</span>
            </div>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'admin';
                setCurrentView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="text-[11px] text-slate-400 hover:text-blue-600 font-bold transition-colors flex items-center gap-1"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
