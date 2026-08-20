import React from 'react';
import { 
  Video, 
  Cloud, 
  ExternalLink, 
  Copy,
  BookOpen,
  FolderCheck,
  Share2
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Course } from '../../types';

export const RecordingsView: React.FC = () => {
  const { 
    enrolledCourses, 
    courses, 
    showToast 
  } = useAcademic();

  const handleOpenOneDrive = (course: Course) => {
    if (course.oneDriveUrl) {
      window.open(course.oneDriveUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opening ${course.shortCode} OneDrive archive...`, 'info');
    } else {
      showToast(`No OneDrive link configured for ${course.shortCode}`, 'alert');
    }
  };

  const handleCopyLink = (course: Course) => {
    if (course.oneDriveUrl) {
      navigator.clipboard.writeText(course.oneDriveUrl);
      showToast(`${course.shortCode} OneDrive link copied to clipboard!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Official Subject Recordings & Archives</h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
              <Cloud className="w-3.5 h-3.5 text-blue-600" /> OneDrive Cloud
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access pre-defined institutional OneDrive recording folders for all subjects. All lecture video streams and session folders are permanently synced.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <FolderCheck className="w-4 h-4 text-emerald-600" />
            {enrolledCourses.length} Active Repositories
          </span>
        </div>
      </div>

      {/* Grid of Subject Recording Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              {/* Header Badge & Code */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-extrabold text-xs px-2.5 py-1 rounded-xl tracking-tight"
                  style={{
                    backgroundColor: `${course.color}15`,
                    color: course.color,
                  }}
                >
                  {course.shortCode} • {course.code}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  course.courseType === 'core' 
                    ? 'bg-slate-100 text-slate-600' 
                    : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {course.courseType}
                </span>
              </div>

              {/* Course Title & Instructor */}
              <h3 className="text-lg font-extrabold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                {course.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {course.professor} • {course.credits} Credits
              </p>

              {/* Recurring Schedule */}
              {course.recurringSchedule && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-medium">
                  <span className="font-bold text-slate-700 block mb-0.5">Regular Slot:</span>
                  {course.recurringSchedule}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => handleOpenOneDrive(course)}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                title={`Open ${course.name} OneDrive Folder`}
              >
                <Video className="w-4 h-4" />
                <span>Open OneDrive Folder</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={() => handleCopyLink(course)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                title="Copy OneDrive Link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
