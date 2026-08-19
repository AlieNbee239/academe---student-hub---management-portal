export type ViewMode = 
  | 'home' 
  | 'calendar' 
  | 'courses' 
  | 'assignments' 
  | 'quizzes' 
  | 'recordings' 
  | 'notifications' 
  | 'admin'
  | 'settings';

export type PlatformType = 'teams' | 'meet' | 'zoom';
export type CourseType = 'core' | 'elective';

export interface Course {
  id: string;
  code: string;
  name: string;
  shortCode: string; // e.g. 'AML'
  courseType: CourseType; // 'core' | 'elective'
  color: string;
  badgeBg: string;
  badgeText: string;
  professor: string;
  email: string;
  credits: number;
  room: string;
  teamsUrl: string;
  permanentMeetingUrl?: string; // Pre-defined permanent meeting link that never changes
  oneDriveUrl: string;
  permanentOneDriveFolder?: string; // e.g. "IIT Patna / MTech-AI-DS / Sem1 / AML"
  syllabus: string;
  enrolledStudentsCount: number;
  recurringSchedule?: string; // e.g. "Every Sunday 5:00 PM - 6:30 PM & Tuesday 10:00 AM"
}

export interface ClassSession {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  lectureNumber: string; // e.g. "Lecture 08"
  professor: string;
  date: string; // YYYY-MM-DD e.g. "2026-08-18"
  startTime: string; // "10:00 AM"
  endTime: string; // "11:00 AM"
  platform: PlatformType;
  meetingUrl: string;
  meetingPasscode?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
  recordingDuration?: string;
  hasRecording: boolean;
  topic?: string;
  isPermanentLink?: boolean; // Pre-defined permanent recurring meeting link
  recurringSlot?: string; // e.g. "Recurring Sunday 5:00 PM Slot"
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string; // "2026-08-18" or "2026-08-22"
  dueTime: string; // "11:59 PM"
  totalPoints: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed';
  type?: 'written' | 'coding' | 'project' | 'lab';
  platformName?: string; // e.g. "HackerRank", "LeetCode", "GitHub Classroom"
  externalUrl?: string; // Direct link to HackerRank or assignment submission platform
  instructions?: string; // Specific administrative instructions for the problem
  isCompleted?: boolean;
  selfScore?: number;
  studentNotes?: string;
  submissionDate?: string;
  submittedFileName?: string;
  submittedFileSize?: string;
  score?: number;
  feedback?: string;
  resourceLinks?: { title: string; url: string }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  date: string; // "2026-08-18"
  dueTime: string; // "11:59 PM"
  durationMinutes: number;
  totalQuestions: number;
  status: 'upcoming' | 'open' | 'completed';
  quizUrl?: string; // Admin-provided link to external quiz/portal page
  score?: number;
  maxScore: number;
  questions?: QuizQuestion[];
}

export interface Recording {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  lectureTitle: string;
  lectureNumber: string; // e.g. "Lecture 01", "Lecture 02", ...
  professor: string;
  date: string; // "2026-08-18"
  duration: string; // "58 min"
  oneDriveUrl: string; // Direct link to OneDrive institutional folder / file
  streamUrl?: string; // Direct video stream source
  thumbnailGradient: string;
  topicTags: string[];
  notesPdfUrl?: string;
  isNew?: boolean;
  fileSize?: string; // e.g. "412 MB"
  cloudStoragePath?: string; // e.g. "IIT Patna / OneDrive / MTech-AI-DS / Sem1 / DAA / Lectures /"
  requiresIitpAuth?: boolean; // Must be authenticated with @iitp.ac.in Outlook ID
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  time: string;
  priority: 'urgent' | 'normal' | 'info';
  courseId?: string;
  courseName?: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ActivityUpdate {
  id: string;
  type: 'deadline' | 'recording' | 'timing' | 'announcement' | 'quiz';
  title: string;
  timeAgo: string;
  color: string;
  linkView?: ViewMode;
  details?: string;
}

export interface StudentProfile {
  name: string;
  role: 'student' | 'admin' | 'sub_admin' | 'faculty';
  program: string;
  studentId: string;
  email: string; // e.g. "supratik_26@iitp.ac.in"
  outlookEmail: string; // Institutional Microsoft 365 Outlook ID (must match @iitp.ac.in)
  isOutlookConnected: boolean; // Authenticated via Microsoft 365
  isOneDriveSynced: boolean; // Institutional OneDrive access active
  avatarUrl: string;
  academicYear: string;
  currentSemester: string;
}

export interface CurriculumConfig {
  maxElectivesAllowed: number;
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  description?: string;
  type?: 'national' | 'institute' | 'recess';
}
