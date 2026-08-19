import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Video, 
  Cloud, 
  Bell, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogIn,
  LogOut,
  Copy,
  Repeat,
  FolderOpen
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const SettingsView: React.FC = () => {
  const { 
    profile, 
    enrolledCourses, 
    updateStudentProfile,
    resetAllData, 
    showToast 
  } = useAcademic();

  const [defaultPlatform, setDefaultPlatform] = useState<'teams' | 'meet'>('teams');
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & Institutional Settings</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your profile, connected calendar, meeting preferences, and academic workspace.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Student Identity & Enrollment
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-xs"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="text-lg font-extrabold text-slate-900">{profile.name}</h4>
            <p className="text-xs font-semibold text-slate-600">{profile.program}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span>Roll: <strong className="text-slate-700">{profile.studentId}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-slate-700">{profile.email}</strong></span>
              <span>•</span>
              <span>{profile.currentSemester}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">Choose a profile avatar</p>
          <div className="flex items-center gap-3">
            {avatars.map((avatar, index) => (
              <button key={avatar} onClick={() => updateStudentProfile({ avatarUrl: avatar })} title={`Avatar ${index + 1}`} className={`rounded-full p-0.5 ${profile.avatarUrl === avatar ? 'ring-2 ring-blue-600 ring-offset-2' : 'hover:ring-2 hover:ring-slate-300'}`}>
                <img src={avatar} alt={`Avatar ${index + 1}`} className="w-10 h-10 rounded-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences & Toggles */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Meeting & Notification Preferences</h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Preferred Meeting Client</p>
              <p className="text-slate-500">Default application launched when joining class</p>
            </div>
            <select
              value={defaultPlatform}
              onChange={(e) => setDefaultPlatform(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="teams">Microsoft Teams (Native / Web)</option>
              <option value="meet">Google Meet</option>
            </select>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Google Calendar Synchronization</p>
              <p className="text-slate-500">Available only after you connect your Google account.</p>
            </div>
            <input
              type="checkbox"
              checked={calendarSyncEnabled}
              disabled
              onChange={(e) => setCalendarSyncEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Urgent Broadcast Push Notifications</p>
              <p className="text-slate-500">Notify instantly when deadlines change or class timings update</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => showToast('Settings preferences saved successfully!', 'success')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Save Preferences
          </button>

          <button
            onClick={resetAllData}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Application Data
          </button>
        </div>
      </div>
    </div>
  );
};
