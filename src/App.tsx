import React, { useEffect } from 'react';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RightBriefPanel } from './components/RightBriefPanel';
import { HomeDashboard } from './components/views/HomeDashboard';
import { CalendarView } from './components/views/CalendarView';
import { CoursesView } from './components/views/CoursesView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { QuizzesView } from './components/views/QuizzesView';
import { RecordingsView } from './components/views/RecordingsView';
import { NotificationsView } from './components/views/NotificationsView';
import { AdminPanel } from './components/views/AdminPanel';
import { AboutView } from './components/views/AboutView';
import { AdminLogin } from './components/AdminLogin';
import { JoinMeetingModal } from './components/modals/JoinMeetingModal';
import { AssignmentModal } from './components/modals/AssignmentModal';
import { QuizModal } from './components/modals/QuizModal';
import { SearchModal } from './components/modals/SearchModal';
import { ElectiveSelectionModal } from './components/modals/ElectiveSelectionModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, authLoading, profile, setIsAdminMode } = useAcademic();

  // Listen to hash / URL for #admin or /admin routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || pathname === '/admin') {
        setCurrentView('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setCurrentView]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">
        Loading portal...
      </div>
    );
  }

  const isSuperAdmin = profile.email === 'myselfsupratik@gmail.com';
  const canManage = isSuperAdmin || profile.role === 'admin' || profile.role === 'sub_admin';

  // If user visits /admin or #admin and is not authenticated as admin, show dedicated AdminLogin
  if (currentView === 'admin' && !canManage) {
    return <AdminLogin />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard />;
      case 'calendar':
        return <CalendarView />;
      case 'courses':
        return <CoursesView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'quizzes':
        return <QuizzesView />;
      case 'recordings':
        return <RecordingsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'about':
        return <AboutView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <div className="p-6 md:px-8 md:pb-12 max-w-7xl w-full mx-auto flex-1">
          {renderActiveView()}
        </div>
      </main>

      {/* Permanent Right Day Brief Inspector Panel in Desktop View (Fixed on xl+ screens & Mobile/Tablet drawer) */}
      <RightBriefPanel />

      {/* Global Modals & Notifications */}
      <JoinMeetingModal />
      <AssignmentModal />
      <QuizModal />
      <SearchModal />
      <ElectiveSelectionModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AcademicProvider>
      <AppContent />
    </AcademicProvider>
  );
}

