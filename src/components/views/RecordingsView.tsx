import React, { useState } from 'react';
import { 
  Video, 
  Cloud, 
  Search, 
  Play, 
  ExternalLink, 
  Download, 
  Clock, 
  Tag,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  LogIn,
  Repeat
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Course, Recording } from '../../types';

export const RecordingsView: React.FC = () => {
  const { 
    filteredRecordings, 
    enrolledCourses, 
    courses, 
    profile,
  } = useAcademic();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchTopic, setSearchTopic] = useState<string>('');

  const openRecording = (recording: Recording) => {
    window.open(recording.oneDriveUrl, '_blank', 'noopener,noreferrer');
  };

  // Course currently selected for detailed history
  const activeCourse = selectedCourseId ? courses.find(c => c.id === selectedCourseId) : null;

  // Recordings for the active selected course sorted by date descending
  const subjectRecordings = selectedCourseId
    ? filteredRecordings.filter(r => r.courseId === selectedCourseId)
    : filteredRecordings;

  const filtered = subjectRecordings.filter(r => {
    if (searchTopic) {
      const q = searchTopic.toLowerCase();
      const matchTitle = r.lectureTitle.toLowerCase().includes(q);
      const matchProf = r.professor.toLowerCase().includes(q);
      const matchTag = r.topicTags.some(t => t.toLowerCase().includes(q));
      const matchDate = r.date.includes(q);
      if (!matchTitle && !matchProf && !matchTag && !matchDate) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">OneDrive Subject Recordings Archive</h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
              <Cloud className="w-3.5 h-3.5 text-blue-600" /> Microsoft 365 OneDrive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse full lecture history by date, stream video lectures, and access permanent course repositories on OneDrive.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div><span className="block font-bold leading-none">Verified IITP Account</span><span className="text-[10px] text-emerald-600 font-normal">{profile.email}</span></div>
          </div>
        </div>
      </div>

      {/* SUBJECT SELECTOR (Tabs / Cards to pick subject) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-500" />
            Select Subject for Full Lecture Date History
          </span>
          {selectedCourseId && (
            <button
              onClick={() => setSelectedCourseId(null)}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View All Subjects
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedCourseId(null)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedCourseId === null
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <span className="text-[10px] font-bold uppercase opacity-80 block">All Courses</span>
            <h4 className="text-xs font-extrabold truncate mt-0.5">All Archives</h4>
            <span className="text-[10px] opacity-75 mt-1 block">
              {filteredRecordings.length} total recordings
            </span>
          </button>

          {enrolledCourses.map((course) => {
            const count = filteredRecordings.filter(r => r.courseId === course.id).length;
            const isSelected = selectedCourseId === course.id;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${course.color}15`,
                      color: course.color,
                    }}
                  >
                    {course.shortCode}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {count} Lecs
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 truncate mt-2 group-hover:text-blue-600 transition-colors">
                  {course.name}
                </h4>

                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {course.professor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            placeholder={activeCourse ? `Search in ${activeCourse.name} (topic, date, tag)...` : "Search all recordings (topic, date, professor)..."}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-hidden focus:border-blue-500"
          />
        </div>

        {activeCourse && (
          <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl flex items-center gap-2">
            <span>Showing <strong className="text-blue-600">{activeCourse.name}</strong> ({filtered.length} recorded lectures)</span>
          </div>
        )}
      </div>

      {/* RECORDINGS LIST / SUBJECT DATE HISTORY */}
      {selectedCourseId && activeCourse ? (
        /* Detailed Subject Date History Table/List */
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: `${activeCourse.color}15`, color: activeCourse.color }}
                >
                  {activeCourse.shortCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeCourse.name} — Lecture History by Date
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>Instructor: <strong>{activeCourse.professor}</strong></span>
                <span>•</span>
                <span>Permanent Slot: <strong>{activeCourse.recurringSlot || 'Sunday 5:00 PM'}</strong></span>
              </p>
            </div>

          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No previous recordings found matching your query.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div 
                      onClick={() => openRecording(rec)}
                      className={`w-14 h-14 rounded-xl bg-linear-to-tr ${rec.thumbnailGradient} flex items-center justify-center text-white shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {rec.lectureNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {rec.date}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {rec.duration}
                        </span>
                        {rec.fileSize && (
                          <span className="text-[10px] font-medium text-slate-400">
                            • {rec.fileSize}
                          </span>
                        )}
                        {rec.isNew && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[9px] rounded-full uppercase">
                            Latest
                          </span>
                        )}
                      </div>

                      <h4 
                        onClick={() => openRecording(rec)}
                        className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer mt-0.5"
                      >
                        {rec.lectureTitle}
                      </h4>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rec.topicTags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <button
                      onClick={() => openRecording(rec)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Watch Video
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Recordings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Container */}
                <div 
                  onClick={() => openRecording(rec)}
                  className={`relative rounded-2xl bg-linear-to-tr ${rec.thumbnailGradient} p-4 aspect-video flex flex-col justify-between text-white cursor-pointer overflow-hidden group-hover:scale-[1.01] transition-transform shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold">
                      {rec.courseCode}
                    </span>
                    {rec.isNew && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[9px] font-extrabold uppercase">
                        New
                      </span>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 ml-0.5 fill-white" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl">
                    <span>{rec.duration}</span>
                    <span>{rec.date}</span>
                  </div>
                </div>

                {/* Title & Info */}
                <h3 
                  onClick={() => openRecording(rec)}
                  className="text-sm font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {rec.lectureTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rec.professor} • {rec.lectureNumber}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {rec.topicTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openRecording(rec)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Watch Video
                </button>

                <button
                  onClick={() => setSelectedCourseId(rec.courseId)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Date History <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
