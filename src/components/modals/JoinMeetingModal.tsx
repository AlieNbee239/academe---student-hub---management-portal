import React from 'react';
import { X, Video, ExternalLink, Copy, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const JoinMeetingModal: React.FC = () => {
  const { activeMeetingModal, setActiveMeetingModal, profile, showToast } = useAcademic();

  if (!activeMeetingModal) return null;

  const session = activeMeetingModal;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.meetingUrl);
    showToast('Microsoft Teams link copied.', 'success');
  };
  const handleOpenTeams = () => {
    window.open(session.meetingUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening Microsoft Teams.', 'info');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{session.courseCode}</span>
              <span className="text-xs font-semibold text-slate-500">Microsoft Teams</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{session.courseName}</h3>
            <p className="text-xs text-slate-500 mt-1">{session.lectureNumber}</p>
          </div>
          <button onClick={() => setActiveMeetingModal(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700"><Calendar className="w-4 h-4 text-blue-600" />{session.date}</div>
          <div className="flex items-center gap-2 text-slate-700"><Clock className="w-4 h-4 text-blue-600" />{session.startTime} - {session.endTime}</div>
          <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600" />{profile.name} • {session.professor}</div>
        </div>

        <p className="text-xs text-slate-500 mt-4">This is a direct Microsoft Teams link. Camera and microphone settings are controlled inside Teams.</p>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={handleOpenTeams} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20">
            <Video className="w-4 h-4" /> Open Microsoft Teams <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleCopyLink} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl" title="Copy Teams link" aria-label="Copy Teams link">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
