import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Megaphone, 
  AlertTriangle, 
  Info, 
  Clock, 
  Trash2, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const NotificationsView: React.FC = () => {
  const { 
    announcements, 
    markAnnouncementAsRead, 
    markAllAnnouncementsAsRead, 
    deleteAnnouncement,
    setCurrentView,
    showToast
  } = useAcademic();

  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'normal' | 'info'>('all');

  const filtered = announcements.filter(a => {
    if (priorityFilter === 'all') return true;
    return a.priority === priorityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Alerts & Announcements</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time push notifications from professors, department coordinators, and schedule updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllAnnouncementsAsRead}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Priority Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'urgent', label: '🔴 Urgent' },
          { id: 'normal', label: '🟢 Normal' },
          { id: 'info', label: '🔵 Informational' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPriorityFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              priorityFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-100">
            No announcements under this filter.
          </div>
        ) : (
          filtered.map((ann) => {
            const isUrgent = ann.priority === 'urgent';
            return (
              <div
                key={ann.id}
                onClick={() => markAnnouncementAsRead(ann.id)}
                className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                  !ann.read 
                    ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10' 
                    : 'bg-white/80 border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUrgent ? 'bg-red-50 text-red-600' : ann.priority === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm ${!ann.read ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                        {ann.title}
                      </h3>
                      {!ann.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                      <span className="text-[11px] text-slate-400">
                        • {ann.date} at {ann.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {ann.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-semibold text-slate-500">
                      <span>Sender: <strong className="text-slate-700">{ann.author}</strong> ({ann.authorRole})</span>
                      {ann.courseName && (
                        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          {ann.courseName}
                        </span>
                      )}
                      {ann.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ann.actionUrl === '#assignments') setCurrentView('assignments');
                            if (ann.actionUrl === '#recordings') setCurrentView('recordings');
                          }}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          {ann.actionLabel || 'View Attached Link →'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnouncement(ann.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
