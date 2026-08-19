import React from 'react';
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
import { SettingsView } from './components/views/SettingsView';
import { JoinMeetingModal } from './components/modals/JoinMeetingModal';
import { AssignmentModal } from './components/modals/AssignmentModal';
import { QuizModal } from './components/modals/QuizModal';
import { SearchModal } from './components/modals/SearchModal';
import { ElectiveSelectionModal } from './components/modals/ElectiveSelectionModal';
import { Toast } from './components/Toast';
import { AuthScreen } from './components/AuthScreen';

const AppContent: React.FC = () => {
  const { currentView, authLoading, isAuthenticated, profile } = useAcademic();

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500">Checking your session...</div>;
  }

  const requiresSignIn = currentView === 'assignments' || currentView === 'quizzes' || currentView === 'notifications';

  if (!isAuthenticated && requiresSignIn) {
    return <AuthScreen />;
  }

  const canManage = profile.role === 'admin' || profile.role === 'sub_admin';

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
      case 'admin':
        return canManage ? <AdminPanel /> : <HomeDashboard />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeDashboard />;
    }
  };

  // Only show the right brief panel in views where it complements the experience (like home and calendar)
  const shouldShowRightPanel = currentView === 'home' || currentView === 'calendar';

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

      {/* Right Day Brief Inspector Panel (Desktop fixed & Mobile/Tablet drawer) */}
      <RightBriefPanel />

      {/* Global Modals & Notifications */}
      <JoinMeetingModal />
      <AssignmentModal />
      <QuizModal />
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
