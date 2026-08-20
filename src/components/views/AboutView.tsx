import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Mail, 
  Heart, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3">
            <Info className="w-4 h-4" />
            About Academe Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built by a Student, for Fellow Students
          </h1>
          <p className="text-sm text-blue-100 mt-2 max-w-2xl font-medium leading-relaxed">
            An open academic organizer designed to keep lecture timetables, assignment due dates, quiz alerts, and OneDrive recording links accessible in one clean dashboard.
          </p>
        </div>
      </div>

      {/* Creator & Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Creator Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-sm mb-3">
              🐝
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Developer & Maintainer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Student Developer Initiative</p>

            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Name:</span>
              <span className="text-sm font-extrabold text-blue-600">Alien Bee</span>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Contact Email</span>
              <a 
                href="mailto:supratik_pa2610mth53@iitp.ac.in" 
                className="text-xs font-extrabold text-blue-700 hover:underline truncate block"
              >
                supratik_pa2610mth53@iitp.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* Zero Personal Info & Privacy Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Zero Personal Data Collection</h2>
            <p className="text-xs text-slate-500 mt-0.5">Privacy First Guarantee</p>

            <p className="text-xs text-slate-600 leading-relaxed mt-3">
              This website does <strong>NOT</strong> collect, store, track, or share any personal student information. Students are not required to enter logins or credentials to view schedules and course materials.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Client-Side Timetable Workspace</span>
          </div>
        </div>
      </div>

      {/* Official Takedown & Administration Notice */}
      <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Official Notice & Takedown Requests</span>
        </div>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          If IIT Patna administration, departments, or faculty members wish to update, modify, or take down this website or any associated link, please contact directly at{' '}
          <a 
            href="mailto:supratik_pa2610mth53@iitp.ac.in" 
            className="font-extrabold text-amber-950 underline hover:text-amber-800"
          >
            supratik_pa2610mth53@iitp.ac.in
          </a>. All requests will be addressed promptly.
        </p>
      </div>

      {/* Disclaimer Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Independent Initiative Disclaimer</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal is an independent timetable assistant created by a student. It is not an official release from IIT Patna. The website owner/maintainer assumes no responsibility for missed classes or scheduling discrepancies. Please always refer to official institute portals for authoritative scheduling.
        </p>
      </div>
    </div>
  );
};
