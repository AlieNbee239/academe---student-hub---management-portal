import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Megaphone, 
  Calendar, 
  FileText, 
  Video, 
  CheckSquare, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2,
  Clock,
  RotateCcw,
  Cloud,
  BookOpen,
  SlidersHorizontal,
  Check,
  Sun,
  X,
  Play,
  Copy,
  Repeat,
  Lock,
  KeyRound
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { PlatformType, CourseType, ClassSession, Assignment, Quiz, Recording, Holiday } from '../../types';
import { apiRequest } from '../../utils/api';
import { TimePicker } from '../common/TimePicker';

export const AdminPanel: React.FC = () => {
  const { 
    courses, 
    classSessions, 
    assignments, 
    quizzes, 
    recordings, 
    holidays,
    announcements,
    curriculumConfig,
    updateCurriculumConfig,
    updateCourseType,
    updateCourseLinks,
    pushAnnouncement,
    addClassSession,
    updateClassSession,
    deleteClassSession,
    generateRecurringSchedule,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    addRecording,
    updateRecording,
    deleteRecording,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    deleteAnnouncement,
    resetAllData,
    clearAllData,
    showToast,
    setCurrentView
  } = useAcademic();

  const [activeTab, setActiveTab] = useState<'broadcast' | 'classes' | 'links' | 'holidays' | 'assignments' | 'quizzes' | 'recordings' | 'curriculum' | 'roster' | 'security'>('classes');

  // Edit Modals / States
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingRecording, setEditingRecording] = useState<Recording | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editingLinksCourseId, setEditingLinksCourseId] = useState<string | null>(null);
  const [linkMeetingUrl, setLinkMeetingUrl] = useState('');
  const [linkOneDriveUrl, setLinkOneDriveUrl] = useState('');

  // Password Management State
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Auto-schedule generator state
  const [autoScheduleStart, setAutoScheduleStart] = useState('2026-08-19');
  const [autoScheduleEnd, setAutoScheduleEnd] = useState('2026-12-31');

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'urgent' | 'normal' | 'info'>('urgent');
  const [broadcastCourseId, setBroadcastCourseId] = useState<string>('');

  // Class Form State (New)
  const [classCourseId, setClassCourseId] = useState<string>('');
  const [classLectureNum, setClassLectureNum] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classStartTime, setClassStartTime] = useState('');
  const [classEndTime, setClassEndTime] = useState('');
  const [classPlatform, setClassPlatform] = useState<PlatformType>('teams');
  const [classMeetingUrl, setClassMeetingUrl] = useState('');
  const [classPasscode, setClassPasscode] = useState('');

  // Holiday Form State (New)
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [holidayDesc, setHolidayDesc] = useState('');
  const [holidayType, setHolidayType] = useState<'national' | 'institute' | 'recess'>('national');

  // Assignment Form State (New)
  const [assignCourseId, setAssignCourseId] = useState<string>('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignDueTime, setAssignDueTime] = useState('');
  const [assignType, setAssignType] = useState<'written' | 'coding' | 'project'>('written');
  const [assignPlatformName, setAssignPlatformName] = useState('');
  const [assignExternalUrl, setAssignExternalUrl] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');

  // Recording Form State (New)
  const [recCourseId, setRecCourseId] = useState<string>('');
  const [recTitle, setRecTitle] = useState('');
  const [recLectureNum, setRecLectureNum] = useState('');
  const [recDuration, setRecDuration] = useState('');
  const [recDate, setRecDate] = useState('');
  const [recOneDriveUrl, setRecOneDriveUrl] = useState('');
  const [recTopicTags, setRecTopicTags] = useState('');

  // Quiz Form State (New)
  const [quizCourseId, setQuizCourseId] = useState<string>('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizDate, setQuizDate] = useState('');
  const [quizDuration, setQuizDuration] = useState(0);
  const [quizPoints, setQuizPoints] = useState(0);
  const [quizUrl, setQuizUrl] = useState('');

  // Curriculum Config State
  const [maxElectives, setMaxElectives] = useState(curriculumConfig.maxElectivesAllowed);

  // Handlers
  const handlePushAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) {
      showToast('Please fill in notification title and description', 'alert');
      return;
    }
    pushAnnouncement({
      title: broadcastTitle,
      content: broadcastContent,
      priority: broadcastPriority,
      courseId: broadcastCourseId || undefined,
    });
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === classCourseId);
    if (!course || !classLectureNum || !classDate || !classStartTime || !classEndTime || !classMeetingUrl) {
      showToast('Please complete the course, lecture, date, time, and Teams link.', 'alert');
      return;
    }
    addClassSession({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      lectureNumber: classLectureNum,
      professor: course.professor,
      date: classDate,
      startTime: classStartTime,
      endTime: classEndTime,
      platform: classPlatform,
      meetingUrl: classMeetingUrl,
      meetingPasscode: classPasscode,
      status: 'upcoming',
      hasRecording: false,
    });
    showToast(`Lecture scheduled for ${course.name} on ${classDate}!`, 'success');
    setClassCourseId('');
    setClassLectureNum('');
    setClassDate('');
    setClassStartTime('');
    setClassEndTime('');
    setClassMeetingUrl('');
    setClassPasscode('');
  };

  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    updateClassSession(editingClass.id, editingClass);
    setEditingClass(null);
  };

  const startEditingLinks = (course: typeof courses[number]) => {
    setEditingLinksCourseId(course.id);
    setLinkMeetingUrl(course.permanentMeetingUrl || course.teamsUrl);
    setLinkOneDriveUrl(course.oneDriveUrl);
  };

  const handleUpdateLinks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLinksCourseId || !linkMeetingUrl || !linkOneDriveUrl) return;
    updateCourseLinks(editingLinksCourseId, linkMeetingUrl, linkOneDriveUrl);
    setEditingLinksCourseId(null);
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName || !holidayDate) {
      showToast('Please specify holiday name and date', 'alert');
      return;
    }
    addHoliday({
      date: holidayDate,
      name: holidayName,
      description: holidayDesc || 'Institute Holiday • Academic activities suspended',
      type: holidayType,
    });
    setHolidayName('');
    setHolidayDesc('');
  };

  const handleUpdateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHoliday) return;
    updateHoliday(editingHoliday.id, editingHoliday);
    setEditingHoliday(null);
  };

  const handleRunAutoSchedule = () => {
    if (!autoScheduleEnd) {
      showToast('Please select a target end date', 'alert');
      return;
    }
    generateRecurringSchedule(autoScheduleEnd, autoScheduleStart);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle) {
      showToast('Please provide an assignment title', 'alert');
      return;
    }
    const course = courses.find(c => c.id === assignCourseId);
    if (!course || !assignDueDate || !assignDueTime) {
      showToast('Please complete the course and deadline fields.', 'alert');
      return;
    }
    addAssignment({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      title: assignTitle,
      description: assignDesc || 'Complete the exercises according to the requirements.',
      dueDate: assignDueDate,
      dueTime: assignDueTime,
      totalPoints: 100,
      type: assignType,
      platformName: assignType === 'coding' ? (assignPlatformName || 'HackerRank') : undefined,
      externalUrl: assignType === 'coding' && assignExternalUrl ? assignExternalUrl : undefined,
      instructions: assignInstructions || undefined,
    });
    setAssignTitle('');
    setAssignDesc('');
    setAssignCourseId('');
    setAssignDueDate('');
    setAssignDueTime('');
    setAssignPlatformName('');
    setAssignExternalUrl('');
    setAssignInstructions('');
  };

  const handleUpdateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    updateAssignment(editingAssignment.id, editingAssignment);
    setEditingAssignment(null);
  };

  const handlePublishRecording = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === recCourseId);
    if (!course || !recTitle || !recLectureNum || !recDuration || !recDate || !recOneDriveUrl) {
      showToast('Please complete all recording fields.', 'alert');
      return;
    }
    const tags = recTopicTags.split(',').map(t => t.trim()).filter(Boolean);
    addRecording({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      lectureTitle: recTitle || `${course.name} ${recLectureNum}`,
      lectureNumber: recLectureNum,
      professor: course.professor,
      date: recDate,
      duration: recDuration,
      oneDriveUrl: recOneDriveUrl,
      streamUrl: recOneDriveUrl,
      thumbnailGradient: 'from-blue-600 to-indigo-800',
      topicTags: tags.length ? tags : ['Lecture Recording'],
    });
    setRecTitle('');
    setRecCourseId('');
    setRecLectureNum('');
    setRecDuration('');
    setRecDate('');
    setRecOneDriveUrl('');
    setRecTopicTags('');
  };

  const handleUpdateRecording = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecording) return;
    updateRecording(editingRecording.id, editingRecording);
    setEditingRecording(null);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle) {
      showToast('Please provide a quiz title', 'alert');
      return;
    }
    const course = courses.find(c => c.id === quizCourseId);
    if (!course || !quizDate || !quizDuration || !quizPoints) {
      showToast('Please complete the course, date, duration, and points.', 'alert');
      return;
    }
    addQuiz({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      title: quizTitle,
      description: quizDesc || `Assessment for ${course.name}.`,
      date: quizDate,
      dueTime: '11:59 PM',
      durationMinutes: Number(quizDuration),
      totalQuestions: 5,
      maxScore: Number(quizPoints),
      quizUrl: quizUrl || undefined,
    });
    setQuizCourseId('');
    setQuizTitle('');
    setQuizDesc('');
    setQuizDate('');
    setQuizDuration(0);
    setQuizPoints(0);
    setQuizUrl('');
    setQuizTitle('');
    setQuizDesc('');
  };

  const handleUpdateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;
    updateQuiz(editingQuiz.id, editingQuiz);
    setEditingQuiz(null);
  };

  const handleSaveCurriculumLimit = () => {
    updateCurriculumConfig({ maxElectivesAllowed: Number(maxElectives) });
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPassword || newAdminPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'alert');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      showToast('Passwords do not match', 'alert');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      localStorage.setItem('academe_admin_custom_password', newAdminPassword);
      try {
        await apiRequest('/auth/change-password', {
          email: 'myselfsupratik@gmail.com',
          new_password: newAdminPassword
        });
      } catch (err) {
        // Backend endpoint fallback
      }
      showToast('Admin password updated successfully!', 'success');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
    } catch (err) {
      showToast('Failed to update password', 'alert');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                Academic Management Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Faculty & Administration Control Panel
              </h2>
              <p className="text-sm text-amber-100 mt-1 max-w-2xl font-medium">
                Create & edit class sessions, configure holidays, batch auto-generate timetable schedules, manage coursework, and publish updates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to completely empty all data?')) {
                    clearAllData();
                  }
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
              <button
                onClick={resetAllData}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="px-5 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Return to Student View →
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Courses</span>
              <span className="text-xl font-extrabold">{courses.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Live Classes</span>
              <span className="text-xl font-extrabold">{classSessions.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Holidays</span>
              <span className="text-xl font-extrabold">{holidays.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Assignments</span>
              <span className="text-xl font-extrabold">{assignments.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Recordings</span>
              <span className="text-xl font-extrabold">{recordings.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Quizzes</span>
              <span className="text-xl font-extrabold">{quizzes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: 'classes', label: 'Live Classes & Auto-Schedule', icon: Calendar },
          { id: 'holidays', label: 'Holidays & Off Days', icon: Sun },
          { id: 'assignments', label: 'Assignments & Coursework', icon: FileText },
          { id: 'quizzes', label: 'Quizzes & Tests', icon: CheckSquare },
          { id: 'recordings', label: 'OneDrive Recordings', icon: Video },
          { id: 'broadcast', label: 'Broadcast Notices', icon: Megaphone },
          { id: 'curriculum', label: 'Curriculum Rules', icon: BookOpen },
          { id: 'security', label: 'Security & Password', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE CLASSES & AUTO-SCHEDULE GENERATOR */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Automatic Schedule Generator Card */}
          <div className="bg-linear-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md border border-blue-800/40">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-blue-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Auto-Schedule Timetable Engine
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Generate Recurring Class Schedule Till Specified Date
                </h3>
                <p className="text-xs text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
                  Automatically populates scheduled classes for all courses across the entire semester based on their regular weekly slots. Official holidays are automatically detected and skipped!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                <div>
                  <label className="block text-[10px] font-extrabold text-blue-200 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={autoScheduleStart}
                    onChange={(e) => setAutoScheduleStart(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold border-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-blue-200 uppercase tracking-wider mb-1">
                    Generate Till (End Date) *
                  </label>
                  <input
                    type="date"
                    value={autoScheduleEnd}
                    onChange={(e) => setAutoScheduleEnd(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold border-none"
                  />
                </div>

                <div className="pt-4 sm:pt-0">
                  <button
                    onClick={handleRunAutoSchedule}
                    className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Auto-Place Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create Single Class Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Individual Class Session</h3>
                  <p className="text-xs text-slate-500">Add a one-off or make-up lecture</p>
                </div>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course *</label>
                  <select
                    value={classCourseId}
                    onChange={(e) => setClassCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.shortCode})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Number</label>
                    <input
                      type="text"
                      value={classLectureNum}
                      onChange={(e) => setClassLectureNum(e.target.value)}
                      placeholder="e.g. Lecture 09"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TimePicker
                    label="Start Time"
                    value={classStartTime || '10:00 AM'}
                    onChange={(val) => setClassStartTime(val)}
                    required
                  />
                  <TimePicker
                    label="End Time"
                    value={classEndTime || '11:30 AM'}
                    onChange={(val) => setClassEndTime(val)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Teams / Meet)</label>
                  <input
                    type="url"
                    value={classMeetingUrl}
                    onChange={(e) => setClassMeetingUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Schedule Class
                </button>
              </form>
            </div>

            {/* List of Scheduled Classes with Edit & Delete */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Scheduled Classes ({classSessions.length})
                  </h3>
                  <p className="text-xs text-slate-500">Edit lecture times, links, or remove sessions</p>
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {classSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700">
                          {session.courseCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {session.courseName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {session.lectureNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        📅 <strong>{session.date}</strong> • {session.startTime} - {session.endTime}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingClass(session)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Edit Class"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClassSession(session.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOLIDAYS & OFF DAYS */}
      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Institute Holiday</h3>
                <p className="text-xs text-slate-500">Classes will not be conducted on holiday dates</p>
              </div>
            </div>

            <form onSubmit={handleCreateHoliday} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="e.g. Gandhi Jayanti, Diwali Break, Convocation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={holidayType}
                  onChange={(e) => setHolidayType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="national">National Gazetted Holiday</option>
                  <option value="institute">Institute Holiday</option>
                  <option value="recess">Semester Recess / Break</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  value={holidayDesc}
                  onChange={(e) => setHolidayDesc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Campus closed • Academic activities suspended."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <strong>Important:</strong> Whenever a holiday is marked, the student calendar will highlight the day as off and automatically suppress all classes on that date.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Add Holiday
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Active Institute Holidays ({holidays.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All dates where classes and assessments are suspended
            </p>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏖️</span>
                      <h4 className="text-xs font-bold text-slate-900">{h.name}</h4>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase">
                        {h.type || 'Holiday'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Date: <strong className="text-slate-900">{h.date}</strong>
                    </p>
                    {h.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{h.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingHoliday(h)}
                      className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-100 rounded-xl transition-colors"
                      title="Edit Holiday"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHoliday(h.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Holiday"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Post New Assignment</h3>
                <p className="text-xs text-slate-500">Provide problem requirements & challenge link</p>
              </div>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course *</label>
                  <select
                    value={assignCourseId}
                  onChange={(e) => setAssignCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shortCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming & Paxos Consensus"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Problem Statement</label>
                <textarea
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  rows={3}
                  placeholder="Instructions for students regarding deliverables, test cases..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <TimePicker
                    label="Due Time"
                    value={assignDueTime || '11:59 PM'}
                    onChange={(val) => setAssignDueTime(val)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Type</label>
                <select
                  value={assignType}
                  onChange={(e) => setAssignType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="written">Written / Problem Set</option>
                  <option value="coding">Coding Challenge (HackerRank/LeetCode)</option>
                  <option value="project">Project / Lab Submission</option>
                </select>
              </div>

              {assignType === 'coding' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Platform Name</label>
                      <input
                        type="text"
                        value={assignPlatformName}
                        onChange={(e) => setAssignPlatformName(e.target.value)}
                        placeholder="HackerRank"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Contest URL</label>
                      <input
                        type="url"
                        value={assignExternalUrl}
                        onChange={(e) => setAssignExternalUrl(e.target.value)}
                        placeholder="https://www.hackerrank.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Instructions</label>
                    <textarea
                      value={assignInstructions}
                      onChange={(e) => setAssignInstructions(e.target.value)}
                      rows={2}
                      placeholder="e.g. Login with IIT Patna student email to submit solutions."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Publish Assignment
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Active Assignments ({assignments.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Edit assignment details or delete completed tasks</p>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {assignments.map((assign) => (
                <div
                  key={assign.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700">
                        {assign.courseCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {assign.title}
                      </h4>
                      {assign.type === 'coding' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {assign.platformName || 'Coding'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Due: <strong>{assign.dueDate}</strong> ({assign.dueTime})
                    </p>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {assign.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingAssignment(assign)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAssignment(assign.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Academic Quiz</h3>
                <p className="text-xs text-slate-500">Add weekly knowledge checks and assessments</p>
              </div>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course *</label>
                  <select
                    value={quizCourseId}
                  onChange={(e) => setQuizCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shortCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Quiz 03: Hypothesis Testing & Confidence Intervals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={quizDesc}
                  onChange={(e) => setQuizDesc(e.target.value)}
                  rows={2}
                  placeholder="Topics covered: p-values, t-distribution, MLE..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={quizDate}
                    onChange={(e) => setQuizDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (m)</label>
                  <input
                    type="number"
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={quizPoints}
                    onChange={(e) => setQuizPoints(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Direct Assessment Link</label>
                <input
                  type="url"
                  value={quizUrl}
                  onChange={(e) => setQuizUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Publish Quiz
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Active Quizzes ({quizzes.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Edit quiz dates, duration, links, or remove entries</p>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-800">
                        {quiz.courseCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {quiz.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      📅 {quiz.date} • {quiz.durationMinutes} mins • Max Score: {quiz.maxScore}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingQuiz(quiz)}
                      className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECORDINGS */}
      {activeTab === 'recordings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish OneDrive Recording</h3>
                <p className="text-xs text-slate-500">Provide direct institutional OneDrive video link</p>
              </div>
            </div>

            <form onSubmit={handlePublishRecording} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course *</label>
                  <select
                    value={recCourseId}
                  onChange={(e) => setRecCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shortCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Strong Connectivity"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lecture #</label>
                  <input
                    type="text"
                    value={recLectureNum}
                    onChange={(e) => setRecLectureNum(e.target.value)}
                    placeholder="Lecture 07"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={recDuration}
                    onChange={(e) => setRecDuration(e.target.value)}
                    placeholder="58 min"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">OneDrive Video Link *</label>
                <input
                  type="url"
                  value={recOneDriveUrl}
                  onChange={(e) => setRecOneDriveUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={recTopicTags}
                  onChange={(e) => setRecTopicTags(e.target.value)}
                  placeholder="Graphs, Tarjan, DFS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Publish Recording
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Published Recordings ({recordings.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Edit metadata, URLs, or remove old recordings</p>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {recordings.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {rec.courseCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {rec.lectureTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {rec.lectureNumber} • {rec.duration} • {rec.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingRecording(rec)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Edit Recording"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRecording(rec.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Broadcast Alert / Notice</h3>
                <p className="text-xs text-slate-500">Push real-time alert to all student dashboards</p>
              </div>
            </div>

            <form onSubmit={handlePushAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Schedule Change for AML Lecture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Course (Optional)</label>
                <select
                  value={broadcastCourseId}
                  onChange={(e) => setBroadcastCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="">All Batch Students (General Notice)</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.shortCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={broadcastPriority}
                  onChange={(e) => setBroadcastPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="urgent">🔴 Urgent (Immediate Toast & Banner)</option>
                  <option value="normal">🔵 Normal (Standard Notice)</option>
                  <option value="info">⚪ Info (Advisory / Administrative)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  rows={4}
                  placeholder="Detailed announcement text..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Send Broadcast Notice
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Active Announcements ({announcements.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Notices visible in students' notification center</p>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ann.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Posted by {ann.author} ({ann.authorRole}) on {ann.date} at {ann.time}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CURRICULUM */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Curriculum Rules</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Max Electives Students Can Select
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={maxElectives}
                  onChange={(e) => setMaxElectives(Number(e.target.value))}
                  className="w-24 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white text-center"
                />
                <button
                  type="button"
                  onClick={handleSaveCurriculumLimit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  Update Limit
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Courses & Track Tagging</h3>
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-blue-100 text-blue-700 mr-2">
                      {course.shortCode}
                    </span>
                    <strong className="text-xs text-slate-900">{course.name}</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">{course.professor}</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => updateCourseType(course.id, 'core')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        course.courseType === 'core'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Core
                    </button>
                    <button
                      onClick={() => updateCourseType(course.id, 'elective')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        course.courseType === 'elective'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Elective
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* TAB: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Administrator Password & Credentials</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage portal security and change your administrative login password.</p>
              </div>
            </div>

            {/* Current Admin Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Super Admin Account</span>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-extrabold text-slate-800">myselfsupratik@gmail.com</span>
                </div>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Root Super Admin
                </span>
              </div>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleChangeAdminPassword} className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                New Admin Password
                <div className="relative block mt-1.5">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </label>

              <label className="block text-xs font-bold text-slate-700">
                Confirm New Password
                <div className="relative block mt-1.5">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="password"
                    value={confirmAdminPassword}
                    onChange={(e) => setConfirmAdminPassword(e.target.value)}
                    placeholder="Re-type new password"
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </label>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isUpdatingPassword ? 'Saving Password...' : 'Update Admin Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset admin password to default (AdminPass2026!)?')) {
                      localStorage.removeItem('academe_admin_custom_password');
                      showToast('Admin password reset to default: AdminPass2026!', 'info');
                    }
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Reset Default
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: CLASS SESSION */}
      {/* ========================================================================= */}
      {editingClass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Class Session</h3>
              <button
                onClick={() => setEditingClass(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={editingClass.courseName}
                  onChange={(e) => setEditingClass({ ...editingClass, courseName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingClass.date}
                    onChange={(e) => setEditingClass({ ...editingClass, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Number</label>
                  <input
                    type="text"
                    value={editingClass.lectureNumber}
                    onChange={(e) => setEditingClass({ ...editingClass, lectureNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TimePicker
                  label="Start Time"
                  value={editingClass.startTime || '10:00 AM'}
                  onChange={(val) => setEditingClass({ ...editingClass, startTime: val })}
                  required
                />
                <TimePicker
                  label="End Time"
                  value={editingClass.endTime || '11:30 AM'}
                  onChange={(val) => setEditingClass({ ...editingClass, endTime: val })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link (Teams / Meet)</label>
                <input
                  type="url"
                  value={editingClass.meetingUrl}
                  onChange={(e) => setEditingClass({ ...editingClass, meetingUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: HOLIDAY */}
      {/* ========================================================================= */}
      {editingHoliday && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Holiday</h3>
              <button
                onClick={() => setEditingHoliday(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateHoliday} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  value={editingHoliday.name}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingHoliday.date}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editingHoliday.description || ''}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingHoliday(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: ASSIGNMENT */}
      {/* ========================================================================= */}
      {editingAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Assignment</h3>
              <button
                onClick={() => setEditingAssignment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAssignment} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingAssignment.title}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editingAssignment.description}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editingAssignment.dueDate}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <TimePicker
                    label="Due Time"
                    value={editingAssignment.dueTime || '11:59 PM'}
                    onChange={(val) => setEditingAssignment({ ...editingAssignment, dueTime: val })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">External Challenge / Problem URL</label>
                <input
                  type="url"
                  value={editingAssignment.externalUrl || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, externalUrl: e.target.value })}
                  placeholder="https://www.hackerrank.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions for Students</label>
                <textarea
                  value={editingAssignment.instructions || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, instructions: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: QUIZ */}
      {/* ========================================================================= */}
      {editingQuiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Quiz</h3>
              <button
                onClick={() => setEditingQuiz(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuiz} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingQuiz.title}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editingQuiz.description}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingQuiz.date}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (m)</label>
                  <input
                    type="number"
                    value={editingQuiz.durationMinutes}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    value={editingQuiz.maxScore}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quiz / Portal Link</label>
                <input
                  type="url"
                  value={editingQuiz.quizUrl || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, quizUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQuiz(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: RECORDING */}
      {/* ========================================================================= */}
      {editingRecording && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Recording</h3>
              <button
                onClick={() => setEditingRecording(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecording} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  value={editingRecording.lectureTitle}
                  onChange={(e) => setEditingRecording({ ...editingRecording, lectureTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lecture #</label>
                  <input
                    type="text"
                    value={editingRecording.lectureNumber}
                    onChange={(e) => setEditingRecording({ ...editingRecording, lectureNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingRecording.duration}
                    onChange={(e) => setEditingRecording({ ...editingRecording, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingRecording.date}
                    onChange={(e) => setEditingRecording({ ...editingRecording, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">OneDrive Link</label>
                <input
                  type="url"
                  value={editingRecording.oneDriveUrl}
                  onChange={(e) => setEditingRecording({ ...editingRecording, oneDriveUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRecording(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Recording
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
