import React, { useEffect, useState, useRef } from 'react';
import { 
  X, 
  ExternalLink, 
  Play, 
  Pause, 
  Cloud, 
  Download, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Lock,
  LogIn,
  Copy,
  Share2,
  HardDrive
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const OneDrivePlayerModal: React.FC = () => {
  const { 
    activeRecordingModal, 
    setActiveRecordingModal, 
    profile, 
    loginWithOutlook, 
    isIitpEmail,
    showToast 
  } = useAcademic();
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [emailInput, setEmailInput] = useState(profile.email || 'supratik_26@iitp.ac.in');
  const [authError, setAuthError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoError(false);
  }, [activeRecordingModal?.id]);

  if (!activeRecordingModal) return null;

  const rec = activeRecordingModal;
  const isAuthValid = profile.isOutlookConnected && isIitpEmail(profile.email);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthError('Please enter your IIT Patna Outlook email address.');
      return;
    }
    if (!isIitpEmail(emailInput)) {
      setAuthError('Invalid domain: Please use your official @iitp.ac.in Outlook ID.');
      return;
    }
    setAuthError(null);
    loginWithOutlook(emailInput.trim());
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rec.oneDriveUrl);
    showToast('Permanent OneDrive recording link copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-blue-600" />
                  IIT Patna OneDrive Stream
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {rec.duration} • {rec.date}
                </span>
                {rec.fileSize && (
                  <span className="text-xs font-medium text-slate-400">
                    • {rec.fileSize}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {rec.lectureTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveRecordingModal(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* Institutional SSO Gate Check */}
          {!isAuthValid ? (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-center space-y-4 my-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base font-bold text-slate-900">IIT Patna Outlook Authentication Required</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Institutional OneDrive video streams and course archives are restricted to students logged in with their official <strong>@iitp.ac.in</strong> Outlook email.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-3 pt-2">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g. your_roll@iitp.ac.in"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {authError}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in with IIT Patna Outlook
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('supratik_26@iitp.ac.in');
                      loginWithOutlook('supratik_26@iitp.ac.in');
                    }}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Use Sample IITP ID
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Authenticated Banner */}
              <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200 rounded-2xl px-4 py-2 text-xs text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Microsoft 365 Verified: <strong>{profile.email}</strong></span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  OneDrive Synced
                </span>
              </div>

              {/* Video Player Box */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-md flex items-center justify-center group">
                {rec.streamUrl && !videoError ? (
                  <video
                    ref={videoRef}
                    src={rec.streamUrl}
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setVideoError(true)}
                  />
                ) : (
                  <div className="text-center text-white p-6">
                    <div className="w-16 h-16 rounded-full bg-blue-600/80 flex items-center justify-center mx-auto mb-3">
                      <Play className="w-7 h-7 ml-1" />
                    </div>
                    <h4 className="font-bold text-base">{rec.lectureTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1">Directly streaming from IIT Patna OneDrive Archive</p>
                    <a
                      href={rec.oneDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <Cloud className="w-4 h-4" />
                      Open Recording in OneDrive
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Speed & Stream Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span>Speed:</span>
                  {[1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        playbackSpeed === s
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    Copy OneDrive Link
                  </button>

                  {rec.notesPdfUrl && (
                    <a
                      href={rec.notesPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Lecture Slides PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Cloud Path Info */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-600">
                <HardDrive className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800">Permanent OneDrive Repository Path:</div>
                  <div className="font-mono text-[11px] text-slate-500 truncate mt-0.5">
                    {rec.cloudStoragePath || `IIT Patna / OneDrive / MTech-AI-DS / Sem1 / ${rec.courseCode} / Lectures / ${rec.lectureNumber}`}
                  </div>
                </div>
              </div>

              {/* Topic Tags */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Covered Lecture Topics
                </span>
                <div className="flex flex-wrap gap-2">
                  {rec.topicTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Instructor: <strong className="text-slate-700">{rec.professor}</strong></span>
          <span>Course: <strong className="text-slate-700">{rec.courseName} ({rec.courseCode})</strong></span>
        </div>
      </div>
    </div>
  );
};
