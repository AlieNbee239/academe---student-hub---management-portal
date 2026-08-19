import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Video, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  ArrowRight,
  User,
  HelpCircle
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const SearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    enrolledCourses, 
    filteredClassSessions, 
    filteredAssignments, 
    filteredQuizzes, 
    filteredRecordings,
    setActiveMeetingModal,
    setActiveRecordingModal,
    setActiveAssignmentModal,
    setActiveQuizModal,
    setCurrentView,
    setSelectedCourseFilter
  } = useAcademic();

  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search matches strictly within enrolled student's courses and streams
  const matchedCourses = cleanQuery ? enrolledCourses.filter(c => 
    c.name.toLowerCase().includes(cleanQuery) || 
    c.shortCode.toLowerCase().includes(cleanQuery) ||
    c.code.toLowerCase().includes(cleanQuery) ||
    c.professor.toLowerCase().includes(cleanQuery)
  ) : [];

  const matchedClasses = cleanQuery ? filteredClassSessions.filter(s => 
    s.courseName.toLowerCase().includes(cleanQuery) || 
    s.courseCode.toLowerCase().includes(cleanQuery) ||
    s.professor.toLowerCase().includes(cleanQuery) ||
    s.lectureNumber.toLowerCase().includes(cleanQuery) ||
    (s.topic && s.topic.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedAssignments = cleanQuery ? filteredAssignments.filter(a => 
    a.title.toLowerCase().includes(cleanQuery) || 
    a.courseName.toLowerCase().includes(cleanQuery) ||
    a.courseCode.toLowerCase().includes(cleanQuery) ||
    (a.platformName && a.platformName.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedQuizzes = cleanQuery ? filteredQuizzes.filter(q => 
    q.title.toLowerCase().includes(cleanQuery) || 
    q.courseName.toLowerCase().includes(cleanQuery) ||
    q.courseCode.toLowerCase().includes(cleanQuery)
  ) : [];

  const matchedRecordings = cleanQuery ? filteredRecordings.filter(r => 
    r.lectureTitle.toLowerCase().includes(cleanQuery) || 
    r.lectureNumber.toLowerCase().includes(cleanQuery) ||
    r.courseName.toLowerCase().includes(cleanQuery) ||
    r.courseCode.toLowerCase().includes(cleanQuery) ||
    r.professor.toLowerCase().includes(cleanQuery) ||
    r.topicTags.some(t => t.toLowerCase().includes(cleanQuery))
  ) : [];

  const hasAnyResults = matchedCourses.length > 0 || matchedClasses.length > 0 || matchedAssignments.length > 0 || matchedQuizzes.length > 0 || matchedRecordings.length > 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enrolled classes, OneDrive recordings, assignments, quizzes..."
            className="flex-1 text-sm bg-transparent outline-hidden font-medium text-slate-800 placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cleanQuery ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-500">Quick Navigation</p>
              <p>Type keywords like "Machine Learning", "Segment Tree", "Assignment", or "Prof. Mehta"</p>
            </div>
          ) : !hasAnyResults ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No enrolled results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              {/* Courses */}
              {matchedCourses.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Enrolled Courses ({matchedCourses.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedCourses.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCourseFilter(c.id);
                          setCurrentView('courses');
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              {c.name} ({c.shortCode})
                            </p>
                            <p className="text-[10px] text-slate-500">{c.professor} • {c.code}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {matchedClasses.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Classes & Timetable ({matchedClasses.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedClasses.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveMeetingModal(s);
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Video className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              {s.courseName} • {s.lectureNumber}
                            </p>
                            <p className="text-[10px] text-slate-500">{s.date} at {s.startTime} • {s.professor}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-600">Join</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recordings */}
              {matchedRecordings.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    OneDrive Recordings ({matchedRecordings.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedRecordings.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          window.open(r.oneDriveUrl, '_blank', 'noopener,noreferrer');
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Video className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                              {r.lectureTitle}
                            </p>
                            <p className="text-[10px] text-slate-500">{r.duration} • {r.professor}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Watch</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {matchedAssignments.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Assignments ({matchedAssignments.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedAssignments.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setActiveAssignmentModal(a);
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-red-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-red-700">
                              {a.title}
                            </p>
                            <p className="text-[10px] text-slate-500">Due {a.dueDate} • {a.courseName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-red-600">View</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              {matchedQuizzes.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Quizzes & Assessments ({matchedQuizzes.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedQuizzes.map(q => (
                      <div
                        key={q.id}
                        onClick={() => {
                          setActiveQuizModal(q);
                          setIsSearchModalOpen(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-amber-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                              {q.title}
                            </p>
                            <p className="text-[10px] text-slate-500">Due {q.date} at {q.dueTime} • {q.courseName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-600">Take</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
