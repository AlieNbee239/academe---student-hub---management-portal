import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Cloud, 
  User, 
  Mail, 
  Award, 
  ChevronRight, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Course } from '../../types';
import { getTodayDateString } from '../../utils/date';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    filteredClassSessions, 
    filteredRecordings, 
    selectedCourseFilter, 
    setSelectedCourseFilter,
    selectedElectiveIds,
    curriculumConfig,
    setIsElectiveModalOpen,
    setActiveMeetingModal,
    setActiveRecordingModal,
    showToast
  } = useAcademic();

  const [activeCourseId, setActiveCourseId] = useState<string>(selectedCourseFilter || courses[0]?.id || 'aml');

  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const courseSessions = filteredClassSessions.filter(s => s.courseId === currentCourse.id);
  const courseRecordings = filteredRecordings.filter(r => r.courseId === currentCourse.id);

  const isElective = currentCourse.courseType === 'elective';
  const isEnrolled = !isElective || selectedElectiveIds.includes(currentCourse.id);

  const coreCourses = courses.filter(c => c.courseType === 'core');
  const electiveCourses = courses.filter(c => c.courseType === 'elective');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses & Curriculum</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full">
              {coreCourses.length} Core • {selectedElectiveIds.length}/{curriculumConfig.maxElectivesAllowed} Electives
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse your core syllabus, elective subjects, live meeting links on Teams/Meet, and OneDrive lecture archives.
          </p>
        </div>

        <button
          onClick={() => setIsElectiveModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Choose Electives ({selectedElectiveIds.length}/{curriculumConfig.maxElectivesAllowed})
        </button>
      </div>

      {/* Main Grid: Course selector cards & Active Course Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Core Subjects Section */}
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Compulsory Core Subjects ({coreCourses.length})
            </span>
            <div className="space-y-2.5">
              {coreCourses.map((course) => {
                const isSelected = course.id === activeCourseId;
                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setSelectedCourseFilter(course.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold"
                          style={{
                            backgroundColor: `${course.color}15`,
                            color: course.color,
                          }}
                        >
                          {course.shortCode}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              Core
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{course.code} • {course.credits} Credits</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-blue-600 rotate-90' : 'text-slate-300'}`} />
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                      <span>{course.professor}</span>
                      <span className="text-slate-400">{course.room}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Elective Offerings Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Elective Offerings ({electiveCourses.length})
              </span>
              <span className="text-xs text-indigo-600 font-semibold">
                Pick {curriculumConfig.maxElectivesAllowed}
              </span>
            </div>

            <div className="space-y-2.5">
              {electiveCourses.map((course) => {
                const isSelected = course.id === activeCourseId;
                const isChosen = selectedElectiveIds.includes(course.id);

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setSelectedCourseFilter(course.id);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : isChosen
                        ? 'bg-indigo-50/40 border-indigo-200'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-xs font-extrabold"
                          style={{
                            backgroundColor: `${course.color}15`,
                            color: course.color,
                          }}
                        >
                          {course.shortCode}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                              Elective
                            </span>
                            {isChosen && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Enrolled
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{course.code} • {course.credits} Credits</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-indigo-600 rotate-90' : 'text-slate-300'}`} />
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                      <span>{course.professor}</span>
                      <span className="text-slate-400">{course.room}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Course Deep Dive (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          {/* Course Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-lg">
                  {currentCourse.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentCourse.courseType === 'core' 
                    ? 'bg-slate-100 text-slate-700' 
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentCourse.courseType === 'core' ? 'Core Subject' : 'Elective Subject'}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {currentCourse.credits} Credits • {currentCourse.room}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                {currentCourse.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Instructor: <strong>{currentCourse.professor}</strong> ({currentCourse.email})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMeetingModal({
                  id: `session-course-${currentCourse.id}`,
                  courseId: currentCourse.id,
                  courseCode: currentCourse.code,
                  courseName: currentCourse.name,
                  lectureNumber: 'Live Room',
                  professor: currentCourse.professor,
                  date: getTodayDateString(),
                  startTime: '07:00 PM',
                  endTime: '09:00 PM',
                  platform: 'teams',
                  meetingUrl: currentCourse.permanentMeetingUrl || currentCourse.teamsUrl,
                  status: 'upcoming',
                  hasRecording: false
                })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Video className="w-4 h-4" />
                Join Permanent Room
              </button>
            </div>
          </div>

          {/* Schedule & Syllabus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Recurring Weekly Schedule
              </span>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {currentCourse.recurringSchedule}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Enrolled Students & Room
              </span>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pt-0.5">
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {currentCourse.enrolledStudentsCount} Batch Students • {currentCourse.room}
              </p>
            </div>
          </div>

          {/* Syllabus Topics */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Syllabus & Core Modules
            </h4>
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs font-medium text-slate-700 leading-relaxed">
              {currentCourse.syllabus}
            </div>
          </div>

          {/* Course Lecture Recordings Archive */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                OneDrive Lecture Recordings ({courseRecordings.length})
              </h4>
            </div>

            {courseRecordings.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                No recorded video lectures yet for this subject.
              </p>
            ) : (
              <div className="space-y-2">
                {courseRecordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{rec.lectureTitle}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{rec.lectureNumber} • {rec.date}</p>
                    </div>
                    <button
                      onClick={() => window.open(rec.oneDriveUrl, '_blank', 'noopener,noreferrer')}
                      className="px-3 py-1 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl shadow-2xs transition-all shrink-0"
                    >
                      Watch
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
