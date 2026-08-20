import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  ViewMode, 
  Course, 
  ClassSession, 
  Assignment, 
  Quiz, 
  Recording, 
  Announcement, 
  ActivityUpdate, 
  StudentProfile,
  CurriculumConfig,
  CourseType,
  Holiday
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_COURSES, 
  INITIAL_CLASS_SESSIONS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_QUIZZES, 
  INITIAL_RECORDINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_UPDATES,
  INITIAL_CURRICULUM_CONFIG,
  INITIAL_SELECTED_ELECTIVES,
  INITIAL_HOLIDAYS
} from '../data/mockData';
import { getTodayDateString } from '../utils/date';
import { API_URL, apiRequest, AuthUser } from '../utils/api';

interface AcademicContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  navigateDate: (direction: 'prev' | 'next' | 'today') => void;
  selectedCourseFilter: string | null;
  setSelectedCourseFilter: (courseId: string | null) => void;
  
  // Data State
  profile: StudentProfile;
  courses: Course[];
  enrolledCourses: Course[];
  enrolledCourseIds: Set<string>;
  isCourseEnrolled: (courseId: string) => boolean;
  
  classSessions: ClassSession[];
  filteredClassSessions: ClassSession[];
  
  assignments: Assignment[];
  filteredAssignments: Assignment[];
  
  quizzes: Quiz[];
  filteredQuizzes: Quiz[];
  
  recordings: Recording[];
  filteredRecordings: Recording[];
  
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, updates: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;
  isHoliday: (dateStr: string) => Holiday | undefined;

  announcements: Announcement[];
  recentUpdates: ActivityUpdate[];

  // Curriculum & Electives
  curriculumConfig: CurriculumConfig;
  updateCurriculumConfig: (config: Partial<CurriculumConfig>) => void;
  selectedElectiveIds: string[];
  setSelectedElectiveIds: (ids: string[]) => void;
  toggleElective: (courseId: string) => boolean;
  updateCourseType: (courseId: string, courseType: CourseType) => void;
  updateCourseLinks: (courseId: string, meetingUrl: string, oneDriveUrl: string) => void;
  isElectiveModalOpen: boolean;
  setIsElectiveModalOpen: (open: boolean) => void;

  // Modals & Panels
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isRightBriefDrawerOpen: boolean;
  setIsRightBriefDrawerOpen: (open: boolean) => void;
  activeMeetingModal: ClassSession | null;
  setActiveMeetingModal: (session: ClassSession | null) => void;
  activeRecordingModal: Recording | null;
  setActiveRecordingModal: (rec: Recording | null) => void;
  activeAssignmentModal: Assignment | null;
  setActiveAssignmentModal: (assign: Assignment | null) => void;
  activeQuizModal: Quiz | null;
  setActiveQuizModal: (quiz: Quiz | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  // Admin & Actions
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'alert' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'alert') => void;

  // Student Profile & Microsoft 365 / Outlook Authentication
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  loginWithOutlook: (email: string) => boolean;
  logoutOutlook: () => void;
  isIitpEmail: (email: string) => boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  finishAuthentication: (user: AuthUser) => void;
  signOut: () => Promise<void>;

  // Mutators
  pushAnnouncement: (data: {
    title: string;
    content: string;
    priority: 'urgent' | 'normal' | 'info';
    courseId?: string;
    authorRole?: string;
  }) => void;
  
  // Classes
  addClassSession: (session: Omit<ClassSession, 'id'>) => void;
  updateClassSession: (id: string, updates: Partial<ClassSession>) => void;
  deleteClassSession: (id: string) => void;
  generateRecurringSchedule: (targetEndDate: string, startDate?: string) => number;
  
  // Assignments
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentCompleted: (id: string) => void;
  updateAssignmentSelfScore: (id: string, score?: number, isDone?: boolean, notes?: string) => void;
  submitAssignment: (id: string, fileName: string, fileSize: string) => void;
  gradeAssignment: (id: string, score: number, feedback: string) => void;
  
  // Quizzes
  addQuiz: (quiz: Omit<Quiz, 'id' | 'status'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  submitQuizAttempt: (quizId: string, score: number) => void;
  
  // Recordings
  addRecording: (recording: Omit<Recording, 'id'>) => void;
  updateRecording: (id: string, updates: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;

  // Announcements
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  deleteAnnouncement: (id: string) => void;
  
  // System
  resetAllData: () => void;
  clearAllData: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRightBriefDrawerOpen, setIsRightBriefDrawerOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isElectiveModalOpen, setIsElectiveModalOpen] = useState<boolean>(false);

  // Modals
  const [activeMeetingModal, setActiveMeetingModal] = useState<ClassSession | null>(null);
  const [activeRecordingModal, setActiveRecordingModal] = useState<Recording | null>(null);
  const [activeAssignmentModal, setActiveAssignmentModal] = useState<Assignment | null>(null);
  const [activeQuizModal, setActiveQuizModal] = useState<Quiz | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize from LocalStorage or Defaults
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('academe_v3_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const finishAuthentication = (user: AuthUser) => {
    const isSuperAdmin = user.email.trim().toLowerCase() === 'myselfsupratik@gmail.com';
    const assignedRole = isSuperAdmin ? 'admin' : user.role;
    setProfile(prev => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email,
      outlookEmail: user.email,
      role: assignedRole,
      isOutlookConnected: true,
      isOneDriveSynced: true,
    }));
    setIsAuthenticated(true);
    if (assignedRole === 'admin' || assignedRole === 'sub_admin') {
      setIsAdminMode(true);
    }
    setAuthLoading(false);
  };

  const signOut = async () => {
    try {
      await apiRequest('/auth/logout', {});
    } finally {
      setIsAuthenticated(false);
      setIsAdminMode(false);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(response => response.ok ? response.json() : null)
      .then(user => {
        if (user) finishAuthentication(user);
      })
      .catch(() => {
        // A missing session simply shows the sign-in page.
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('academe_v3_courses');
    const linksVersion = localStorage.getItem('academe_v3_course_links_version');
    return saved && linksVersion === '2026-08-official-links-v2' ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [curriculumConfig, setCurriculumConfig] = useState<CurriculumConfig>(() => {
    const saved = localStorage.getItem('academe_v3_curriculum_config');
    return saved ? JSON.parse(saved) : INITIAL_CURRICULUM_CONFIG;
  });

  const [selectedElectiveIds, setSelectedElectiveIdsState] = useState<string[]>(() => {
    const saved = localStorage.getItem('academe_v3_selected_electives');
    return saved ? JSON.parse(saved) : INITIAL_SELECTED_ELECTIVES;
  });

  const [classSessions, setClassSessions] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('academe_v3_sessions');
    const linksVersion = localStorage.getItem('academe_v3_course_links_version');
    if (!saved || linksVersion !== '2026-08-official-links-v2') {
      const officialLinks = new Map(INITIAL_COURSES.map(course => [course.id, course.permanentMeetingUrl || course.teamsUrl]));
      return INITIAL_CLASS_SESSIONS.map(session => ({
        ...session,
        meetingUrl: officialLinks.get(session.courseId) || session.meetingUrl,
        platform: 'teams',
      }));
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('academe_v3_course_links_version', '2026-08-official-links-v2');
  }, []);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('academe_v3_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('academe_v3_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [recordings, setRecordings] = useState<Recording[]>(() => {
    const saved = localStorage.getItem('academe_v3_recordings');
    const recordings = saved ? JSON.parse(saved) : INITIAL_RECORDINGS;
    return recordings.filter((recording: Recording) => recording.lectureTitle.trim().toLowerCase() !== 'ooo');
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('academe_v3_holidays');
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('academe_v3_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [recentUpdates, setRecentUpdates] = useState<ActivityUpdate[]>(() => {
    const saved = localStorage.getItem('academe_v3_updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('academe_v3_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('academe_v3_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('academe_v3_curriculum_config', JSON.stringify(curriculumConfig));
  }, [curriculumConfig]);

  useEffect(() => {
    localStorage.setItem('academe_v3_selected_electives', JSON.stringify(selectedElectiveIds));
  }, [selectedElectiveIds]);

  useEffect(() => {
    localStorage.setItem('academe_v3_sessions', JSON.stringify(classSessions));
  }, [classSessions]);

  useEffect(() => {
    localStorage.setItem('academe_v3_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('academe_v3_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('academe_v3_recordings', JSON.stringify(recordings));
  }, [recordings]);

  useEffect(() => {
    localStorage.setItem('academe_v3_holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('academe_v3_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('academe_v3_updates', JSON.stringify(recentUpdates));
  }, [recentUpdates]);

  // Derived: Enrolled Courses (Core + Selected Electives)
  const enrolledCourses = useMemo(() => {
    return courses.filter(c => c.courseType === 'core' || selectedElectiveIds.includes(c.id));
  }, [courses, selectedElectiveIds]);

  const enrolledCourseIds = useMemo(() => {
    return new Set(enrolledCourses.map(c => c.id));
  }, [enrolledCourses]);

  const isCourseEnrolled = (courseId: string) => {
    return enrolledCourseIds.has(courseId);
  };

  // Filtered academic streams for student portal
  const filteredClassSessions = useMemo(() => {
    return classSessions.filter(s => enrolledCourseIds.has(s.courseId));
  }, [classSessions, enrolledCourseIds]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => enrolledCourseIds.has(a.courseId));
  }, [assignments, enrolledCourseIds]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => enrolledCourseIds.has(q.courseId));
  }, [quizzes, enrolledCourseIds]);

  const filteredRecordings = useMemo(() => {
    return recordings.filter(r => enrolledCourseIds.has(r.courseId));
  }, [recordings, enrolledCourseIds]);

  // Date Navigator helper (Next / Prev / Today)
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      const today = getTodayDateString();
      setSelectedDate(today);
      showToast(`Jumped to Today (${today})`, 'info');
      return;
    }
    const [year, month, day] = selectedDate.split('-').map(Number);
    const curr = new Date(Date.UTC(year, month - 1, day));
    const offset = direction === 'next' ? 1 : -1;
    curr.setUTCDate(curr.getUTCDate() + offset);
    const nextY = curr.getUTCFullYear();
    const nextM = (curr.getUTCMonth() + 1).toString().padStart(2, '0');
    const nextD = curr.getUTCDate().toString().padStart(2, '0');
    setSelectedDate(`${nextY}-${nextM}-${nextD}`);
  };

  // Curriculum Config & Elective Toggle
  const updateCurriculumConfig = (configUpdates: Partial<CurriculumConfig>) => {
    setCurriculumConfig(prev => {
      const updated = { ...prev, ...configUpdates };
      if (selectedElectiveIds.length > updated.maxElectivesAllowed) {
        setSelectedElectiveIdsState(selectedElectiveIds.slice(0, updated.maxElectivesAllowed));
      }
      return updated;
    });
    showToast(`Curriculum updated: Max electives set to ${configUpdates.maxElectivesAllowed}`, 'success');
  };

  const setSelectedElectiveIds = (ids: string[]) => {
    setSelectedElectiveIdsState(ids.slice(0, curriculumConfig.maxElectivesAllowed));
  };

  const toggleElective = (courseId: string): boolean => {
    const isCurrentlySelected = selectedElectiveIds.includes(courseId);
    
    if (isCurrentlySelected) {
      setSelectedElectiveIdsState(prev => prev.filter(id => id !== courseId));
      showToast(`Deselected elective course.`, 'info');
      return true;
    } else {
      if (selectedElectiveIds.length >= curriculumConfig.maxElectivesAllowed) {
        showToast(
          `Curriculum limit reached! You can only select ${curriculumConfig.maxElectivesAllowed} elective(s).`,
          'alert'
        );
        return false;
      }
      setSelectedElectiveIdsState(prev => [...prev, courseId]);
      showToast(`Selected elective course successfully!`, 'success');
      return true;
    }
  };

  const updateCourseType = (courseId: string, courseType: CourseType) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, courseType };
      }
      return c;
    }));

    if (courseType === 'core') {
      setSelectedElectiveIdsState(prev => prev.filter(id => id !== courseId));
    }

    showToast(`Course classification updated to ${courseType.toUpperCase()}`, 'success');
  };

  const updateCourseLinks = (courseId: string, meetingUrl: string, oneDriveUrl: string) => {
    setCourses(prev => prev.map(course => course.id === courseId
      ? { ...course, teamsUrl: meetingUrl, permanentMeetingUrl: meetingUrl, oneDriveUrl }
      : course
    ));
    setClassSessions(prev => prev.map(session => session.courseId === courseId
      ? { ...session, meetingUrl, platform: 'teams' }
      : session
    ));
    showToast('Course links updated for the course and its scheduled classes.', 'success');
  };

  // Profile & Authentication
  const isIitpEmail = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    return clean.endsWith('@iitp.ac.in') || clean.endsWith('.iitp.ac.in');
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showToast('Student profile updated successfully', 'success');
  };

  // Holiday Management
  const addHoliday = (holidayData: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: `hol-${Date.now()}`
    };
    setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`🎉 Holiday "${holidayData.name}" added on ${holidayData.date}! Classes will be suspended.`, 'success');
  };

  const updateHoliday = (id: string, updates: Partial<Holiday>) => {
    setHolidays(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h).sort((a, b) => a.date.localeCompare(b.date)));
    showToast('Holiday updated!', 'success');
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    showToast('Holiday removed from calendar', 'info');
  };

  const isHoliday = (dateStr: string): Holiday | undefined => {
    return holidays.find(h => h.date === dateStr);
  };

  // Mutators
  const pushAnnouncement = (data: {
    title: string;
    content: string;
    priority: 'urgent' | 'normal' | 'info';
    courseId?: string;
    authorRole?: string;
  }) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      content: data.content,
      author: profile.name || 'Admin',
      authorRole: data.authorRole || 'Class Coordinator',
      date: '2026-08-18',
      time: '12:00 PM',
      priority: data.priority,
      courseId: data.courseId,
      courseName: courses.find(c => c.id === data.courseId)?.name,
      read: false,
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    const newUpdate: ActivityUpdate = {
      id: `up-${Date.now()}`,
      type: 'announcement',
      title: data.title,
      timeAgo: 'Just now',
      color: data.priority === 'urgent' ? '#EF4444' : '#3B82F6',
      linkView: 'notifications',
      details: data.content.slice(0, 80) + '...'
    };
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

    showToast(`Broadcast published to all students!`, 'success');
  };

  const addClassSession = (sessionData: Omit<ClassSession, 'id'>) => {
    const newSession: ClassSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
    };
    setClassSessions(prev => [newSession, ...prev]);

    const newUpdate: ActivityUpdate = {
      id: `up-${Date.now()}`,
      type: 'timing',
      title: `Live Session: ${sessionData.courseName}`,
      timeAgo: 'Just now',
      color: '#3B82F6',
      linkView: 'calendar',
      details: `${sessionData.date} • ${sessionData.startTime} - ${sessionData.endTime}`
    };
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

    showToast(`📅 Session scheduled for ${sessionData.date} (${sessionData.startTime})!`, 'success');
  };

  const updateClassSession = (id: string, updates: Partial<ClassSession>) => {
    setClassSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    if (activeMeetingModal && activeMeetingModal.id === id) {
      setActiveMeetingModal(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Class details updated successfully!', 'success');
  };

  const deleteClassSession = (id: string) => {
    setClassSessions(prev => prev.filter(s => s.id !== id));
    showToast('Class removed from schedule', 'info');
  };

  // Automatic Schedule Generator till target date
  const generateRecurringSchedule = (targetEndDate: string, startDate: string = '2026-08-19'): number => {
    const recurringSlots = [
      // Sunday (0)
      { courseId: 'daa', dayOfWeek: 0, startTime: '08:00 AM', endTime: '09:30 AM', platform: 'teams' as const, topicPrefix: 'Design & Analysis of Algorithms' },
      { courseId: 'pr', dayOfWeek: 0, startTime: '09:30 AM', endTime: '11:00 AM', platform: 'teams' as const, topicPrefix: 'Pattern Recognition' },
      { courseId: 'daa', dayOfWeek: 0, startTime: '11:00 AM', endTime: '01:00 PM', platform: 'teams' as const, topicPrefix: 'Design & Analysis of Algorithms' },
      { courseId: 'fcs', dayOfWeek: 0, startTime: '02:00 PM', endTime: '05:30 PM', platform: 'teams' as const, topicPrefix: 'Foundations of Computer Systems' },
      { courseId: 'pr', dayOfWeek: 0, startTime: '05:00 PM', endTime: '06:30 PM', platform: 'teams' as const, topicPrefix: 'Pattern Recognition' },

      // Tuesday (2)
      { courseId: 'twss', dayOfWeek: 2, startTime: '05:00 PM', endTime: '06:30 PM', platform: 'teams' as const, topicPrefix: 'Technical Writing & Soft Skill' },
      { courseId: 'aml', dayOfWeek: 2, startTime: '07:30 PM', endTime: '09:00 PM', platform: 'teams' as const, topicPrefix: 'Advanced Machine Learning' },

      // Wednesday (3)
      { courseId: 'twss', dayOfWeek: 3, startTime: '05:00 PM', endTime: '06:30 PM', platform: 'teams' as const, topicPrefix: 'Technical Writing & Soft Skill' },
      { courseId: 'pns', dayOfWeek: 3, startTime: '07:00 PM', endTime: '09:30 PM', platform: 'teams' as const, topicPrefix: 'Probability & Statistics' },

      // Thursday (4)
      { courseId: 'pns', dayOfWeek: 4, startTime: '07:00 PM', endTime: '09:30 PM', platform: 'teams' as const, topicPrefix: 'Probability & Statistics' },

      // Saturday (6)
      { courseId: 'daa', dayOfWeek: 6, startTime: '08:00 AM', endTime: '09:30 AM', platform: 'teams' as const, topicPrefix: 'Design & Analysis of Algorithms' },
      { courseId: 'cda', dayOfWeek: 6, startTime: '09:30 AM', endTime: '11:00 AM', platform: 'teams' as const, topicPrefix: 'Computational Data Analysis' },
      { courseId: 'aml', dayOfWeek: 6, startTime: '09:30 AM', endTime: '11:00 AM', platform: 'teams' as const, topicPrefix: 'Advanced Machine Learning' },
      { courseId: 'cda', dayOfWeek: 6, startTime: '11:30 AM', endTime: '01:00 PM', platform: 'teams' as const, topicPrefix: 'Computational Data Analysis' },
      { courseId: 'fcs', dayOfWeek: 6, startTime: '07:30 PM', endTime: '09:30 PM', platform: 'teams' as const, topicPrefix: 'Foundations of Computer Systems' },
    ];

    const holidayDates = new Set(holidays.map(h => h.date));
    const existingKeys = new Set(classSessions.map(s => `${s.courseId}_${s.date}_${s.startTime}`));

    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const [eYear, eMonth, eDay] = targetEndDate.split('-').map(Number);

    const startObj = new Date(Date.UTC(sYear, sMonth - 1, sDay));
    const endObj = new Date(Date.UTC(eYear, eMonth - 1, eDay));

    const newSessions: ClassSession[] = [];
    const curr = new Date(startObj);

    let lectureCounters: Record<string, number> = {};
    courses.forEach(c => {
      lectureCounters[c.id] = classSessions.filter(s => s.courseId === c.id).length;
    });

    while (curr <= endObj) {
      const yearStr = curr.getUTCFullYear();
      const monthStr = (curr.getUTCMonth() + 1).toString().padStart(2, '0');
      const dayStr = curr.getUTCDate().toString().padStart(2, '0');
      const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

      // If this date is a holiday, SKIP generating classes!
      if (!holidayDates.has(dateStr)) {
        const dayOfWeek = curr.getUTCDay(); // 0-6
        const matchingSlots = recurringSlots.filter(s => s.dayOfWeek === dayOfWeek);

        for (const slot of matchingSlots) {
          const course = courses.find(c => c.id === slot.courseId);
          if (course) {
            const key = `${slot.courseId}_${dateStr}_${slot.startTime}`;
            if (!existingKeys.has(key)) {
              lectureCounters[course.id] = (lectureCounters[course.id] || 0) + 1;
              const lecNum = `Lecture ${lectureCounters[course.id].toString().padStart(2, '0')}`;
              
              newSessions.push({
                id: `session-auto-${course.id}-${dateStr}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                courseId: course.id,
                courseCode: course.code,
                courseName: course.name,
                lectureNumber: lecNum,
                professor: course.professor,
                date: dateStr,
                startTime: slot.startTime,
                endTime: slot.endTime,
                platform: slot.platform,
                meetingUrl: course.permanentMeetingUrl || course.teamsUrl,
                status: 'upcoming',
                hasRecording: false,
                isPermanentLink: true,
                topic: `${course.shortCode}: ${slot.topicPrefix}`,
                recurringSlot: `Regular ${course.shortCode} Slot`
              });
              existingKeys.add(key);
            }
          }
        }
      }

      // Increment day
      curr.setUTCDate(curr.getUTCDate() + 1);
    }

    if (newSessions.length > 0) {
      setClassSessions(prev => [...prev, ...newSessions]);
      showToast(`🗓️ Automatically generated ${newSessions.length} class sessions up to ${targetEndDate} (holidays safely skipped)!`, 'success');
    } else {
      showToast(`All schedule slots up to ${targetEndDate} are already populated.`, 'info');
    }

    return newSessions.length;
  };

  const addAssignment = (assignData: Omit<Assignment, 'id' | 'status'>) => {
    const newAssign: Assignment = {
      ...assignData,
      id: `assign-${Date.now()}`,
      status: 'pending',
      isCompleted: false,
    };
    setAssignments(prev => [newAssign, ...prev]);

    const newUpdate: ActivityUpdate = {
      id: `up-${Date.now()}`,
      type: 'deadline',
      title: `New Assignment Due: ${assignData.title}`,
      timeAgo: 'Just now',
      color: '#EF4444',
      linkView: 'assignments',
      details: `Due on ${assignData.dueDate} at ${assignData.dueTime}`
    };
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

    showToast(`📝 Assignment added! Due ${assignData.dueDate} synced to calendar.`, 'success');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (activeAssignmentModal && activeAssignmentModal.id === id) {
      setActiveAssignmentModal(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Assignment updated successfully!', 'success');
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    showToast('Assignment deleted', 'info');
  };

  const toggleAssignmentCompleted = (id: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const nextCompleted = !a.isCompleted;
        const nextStatus = nextCompleted ? (a.status === 'pending' ? 'submitted' : a.status) : 'pending';
        return {
          ...a,
          isCompleted: nextCompleted,
          status: nextStatus,
        };
      }
      return a;
    }));
    showToast('Assignment status updated!', 'info');
  };

  const updateAssignmentSelfScore = (id: string, score?: number, isDone?: boolean, notes?: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const nextCompleted = isDone !== undefined ? isDone : (score !== undefined ? true : a.isCompleted);
        const nextStatus = nextCompleted 
          ? (a.status === 'pending' ? 'completed' : a.status) 
          : (a.status === 'completed' ? 'pending' : a.status);
        return {
          ...a,
          selfScore: score,
          score: score !== undefined ? score : a.score,
          isCompleted: nextCompleted,
          status: nextStatus,
          studentNotes: notes !== undefined ? notes : a.studentNotes,
        };
      }
      return a;
    }));
    if (activeAssignmentModal && activeAssignmentModal.id === id) {
      setActiveAssignmentModal(prev => {
        if (!prev) return null;
        const nextCompleted = isDone !== undefined ? isDone : (score !== undefined ? true : prev.isCompleted);
        const nextStatus = nextCompleted 
          ? (prev.status === 'pending' ? 'completed' : prev.status) 
          : (prev.status === 'completed' ? 'pending' : prev.status);
        return {
          ...prev,
          selfScore: score,
          score: score !== undefined ? score : prev.score,
          isCompleted: nextCompleted,
          status: nextStatus,
          studentNotes: notes !== undefined ? notes : prev.studentNotes,
        };
      });
    }
    showToast(`Saved assignment evaluation & progress!`, 'success');
  };

  const submitAssignment = (id: string, fileName: string, fileSize: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'submitted',
          isCompleted: true,
          submissionDate: '2026-08-18',
          submittedFileName: fileName,
          submittedFileSize: fileSize,
        };
      }
      return a;
    }));
    showToast(`✅ Assignment submitted (${fileName})`, 'success');
  };

  const gradeAssignment = (id: string, score: number, feedback: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'completed',
          isCompleted: true,
          score,
          selfScore: score,
          feedback,
        };
      }
      return a;
    }));
    showToast(`Grade recorded for assignment! Score: ${score}`, 'success');
  };

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'status'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      status: 'open',
    };
    setQuizzes(prev => [newQuiz, ...prev]);

    const newUpdate: ActivityUpdate = {
      id: `up-${Date.now()}`,
      type: 'quiz',
      title: `Quiz published: ${quizData.title}`,
      timeAgo: 'Just now',
      color: '#F97316',
      linkView: 'quizzes',
    };
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

    showToast(`⚡ Quiz "${quizData.title}" published!`, 'success');
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    if (activeQuizModal && activeQuizModal.id === id) {
      setActiveQuizModal(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Quiz updated successfully!', 'success');
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    showToast('Quiz deleted', 'info');
  };

  const submitQuizAttempt = (quizId: string, score: number) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          status: 'completed',
          score,
        };
      }
      return q;
    }));
    showToast(`🎉 Quiz completed! You scored ${score} pts.`, 'success');
  };

  const addRecording = (recordingData: Omit<Recording, 'id'>) => {
    const newRec: Recording = {
      ...recordingData,
      id: `rec-${Date.now()}`,
      isNew: true,
    };
    setRecordings(prev => [newRec, ...prev]);

    const newUpdate: ActivityUpdate = {
      id: `up-${Date.now()}`,
      type: 'recording',
      title: `New recording: ${recordingData.lectureTitle}`,
      timeAgo: 'Just now',
      color: '#10B981',
      linkView: 'recordings',
      details: `${recordingData.duration} • OneDrive Cloud`
    };
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

    showToast(`🎬 OneDrive Recording added: ${recordingData.lectureTitle}`, 'success');
  };

  const updateRecording = (id: string, updates: Partial<Recording>) => {
    setRecordings(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    if (activeRecordingModal && activeRecordingModal.id === id) {
      setActiveRecordingModal(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Recording updated successfully!', 'success');
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    showToast('Recording deleted', 'info');
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAnnouncementsAsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, read: true })));
    showToast('All notices marked as read', 'info');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Announcement removed', 'info');
  };

  const loginWithOutlook = (email: string): boolean => {
    if (!isIitpEmail(email)) {
      showToast('Authentication failed: Please enter a valid @iitp.ac.in student Outlook ID', 'alert');
      return false;
    }
    setProfile(prev => ({
      ...prev,
      email: email.trim().toLowerCase(),
      outlookEmail: email.trim().toLowerCase(),
      isOutlookConnected: true,
      isOneDriveSynced: true,
    }));
    showToast(`✅ Successfully authenticated via IIT Patna Microsoft 365 (${email})!`, 'success');
    return true;
  };

  const logoutOutlook = () => {
    setProfile(prev => ({
      ...prev,
      isOutlookConnected: false,
      isOneDriveSynced: false,
    }));
    showToast('Signed out of IIT Patna Microsoft 365 / OneDrive session', 'info');
  };

  const resetAllData = () => {
    const officialLinks = new Map(INITIAL_COURSES.map(course => [course.id, course.permanentMeetingUrl || course.teamsUrl]));
    localStorage.clear();
    setProfile(INITIAL_STUDENT_PROFILE);
    setCourses(INITIAL_COURSES);
    setClassSessions(INITIAL_CLASS_SESSIONS.map(session => ({
      ...session,
      meetingUrl: officialLinks.get(session.courseId) || session.meetingUrl,
      platform: 'teams',
    })));
    setAssignments(INITIAL_ASSIGNMENTS);
    setQuizzes(INITIAL_QUIZZES);
    setRecordings(INITIAL_RECORDINGS);
    setHolidays(INITIAL_HOLIDAYS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRecentUpdates(INITIAL_UPDATES);
    setSelectedElectiveIdsState(INITIAL_SELECTED_ELECTIVES);
    setCurriculumConfig(INITIAL_CURRICULUM_CONFIG);
    showToast('Dashboard reset to default state', 'info');
  };

  const clearAllData = () => {
    setCourses([]);
    setClassSessions([]);
    setAssignments([]);
    setQuizzes([]);
    setRecordings([]);
    setHolidays([]);
    setAnnouncements([]);
    setRecentUpdates([]);
    setSelectedElectiveIdsState([]);
    showToast('All academic data has been cleared', 'alert');
  };

  return (
    <AcademicContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedDate,
        setSelectedDate,
        navigateDate,
        selectedCourseFilter,
        setSelectedCourseFilter,
        profile,
        courses,
        enrolledCourses,
        enrolledCourseIds,
        isCourseEnrolled,
        classSessions,
        filteredClassSessions,
        assignments,
        filteredAssignments,
        quizzes,
        filteredQuizzes,
        recordings,
        filteredRecordings,
        holidays,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        isHoliday,
        announcements,
        recentUpdates,
        curriculumConfig,
        updateCurriculumConfig,
        selectedElectiveIds,
        setSelectedElectiveIds,
        toggleElective,
        updateCourseType,
        updateCourseLinks,
        isElectiveModalOpen,
        setIsElectiveModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isRightBriefDrawerOpen,
        setIsRightBriefDrawerOpen,
        activeMeetingModal,
        setActiveMeetingModal,
        activeRecordingModal,
        setActiveRecordingModal,
        activeAssignmentModal,
        setActiveAssignmentModal,
        activeQuizModal,
        setActiveQuizModal,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAdminMode,
        setIsAdminMode,
        toastMessage,
        showToast,
        updateStudentProfile,
        loginWithOutlook,
        logoutOutlook,
        isIitpEmail,
        isAuthenticated,
        authLoading,
        finishAuthentication,
        signOut,
        pushAnnouncement,
        addClassSession,
        updateClassSession,
        deleteClassSession,
        generateRecurringSchedule,
        deleteAssignment,
        deleteQuiz,
        addAssignment,
        updateAssignment,
        toggleAssignmentCompleted,
        updateAssignmentSelfScore,
        submitAssignment,
        gradeAssignment,
        addQuiz,
        updateQuiz,
        submitQuizAttempt,
        addRecording,
        updateRecording,
        deleteRecording,
        markAnnouncementAsRead,
        markAllAnnouncementsAsRead,
        deleteAnnouncement,
        resetAllData,
        clearAllData,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
