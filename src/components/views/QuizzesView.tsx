import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  Play, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const QuizzesView: React.FC = () => {
  const { filteredQuizzes, setActiveQuizModal } = useAcademic();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Quizzes & Assessments</h2>
          <p className="text-xs text-slate-500 mt-1">
            Weekly knowledge checks, timed conceptual assessments, and instant grading breakdown.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Total Completed:</span>
          <span className="px-3 py-1 bg-orange-50 text-orange-700 font-bold text-xs rounded-full">
            {filteredQuizzes.filter(q => q.status === 'completed').length} / {filteredQuizzes.length}
          </span>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuizzes.map((quiz) => {
          const isCompleted = quiz.status === 'completed';
          const isOpen = quiz.status === 'open';

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-orange-50 text-orange-700">
                    {quiz.courseCode}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isOpen
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {quiz.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: <strong>{quiz.durationMinutes} mins</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Points: <strong>{quiz.maxScore}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Scored: {quiz.score} / {quiz.maxScore}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Due by {quiz.date} • {quiz.dueTime}
                  </span>
                )}

                <button
                  onClick={() => {
                    if (quiz.quizUrl && !isCompleted) {
                      window.open(quiz.quizUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      setActiveQuizModal(quiz);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                    isCompleted
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isCompleted ? 'Review Answers' : 'Start Quiz'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
