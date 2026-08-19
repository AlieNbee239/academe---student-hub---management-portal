import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export const QuizModal: React.FC = () => {
  const { activeQuizModal, setActiveQuizModal, submitQuizAttempt, showToast } = useAcademic();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  if (!activeQuizModal) return null;

  const quiz = activeQuizModal;
  const questions = quiz.questions || [
    {
      id: 'default-q1',
      question: `Assessment on core concepts for ${quiz.courseName}. Select the optimal approach:`,
      options: ['Option A (Optimized O(log N))', 'Option B (Linear Scan O(N))', 'Option C (Exponential Search)', 'Option D (Greedy Approximation)'],
      correctAnswerIndex: 0,
      explanation: 'Option A provides logarithmic time complexity suitable for large inputs.'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinishQuiz = () => {
    let score = 0;
    const pointsPerQuestion = quiz.maxScore / questions.length;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += pointsPerQuestion;
      }
    });

    const finalScore = Math.round(score);
    setCalculatedScore(finalScore);
    setSubmitted(true);
    submitQuizAttempt(quiz.id, finalScore);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  {quiz.courseCode}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {quiz.durationMinutes} min limit • {quiz.maxScore} pts max
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {quiz.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveQuizModal(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {quiz.quizUrl && (
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-orange-950 block">Faculty Online Quiz Portal</span>
                <span className="text-[11px] text-orange-700">Admin configured link to direct online assessment page.</span>
              </div>
              <a
                href={quiz.quizUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <span>Go to Quiz Portal</span>
                <CheckSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {submitted ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h4>
                <p className="text-xs text-slate-500 mt-1">Your answers have been graded and recorded</p>
              </div>

              <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Your Score</div>
                <div className="text-3xl font-extrabold text-blue-600 mt-1">
                  {calculatedScore} / {quiz.maxScore}
                </div>
              </div>

              {/* Review question answers */}
              <div className="text-left space-y-4 pt-4 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Detailed Answer Review
                </h5>
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswerIndex;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Q{idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold flex items-center gap-1 shrink-0">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">
                        Your answer: <strong className={isCorrect ? 'text-emerald-600' : 'text-red-500'}>{q.options[selectedAnswers[idx]] || 'None'}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-700 font-medium">
                          Correct answer: <strong>{q.options[q.correctAnswerIndex]}</strong>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-100">
                        💡 {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div>
              {/* Question progress bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                <span className="flex items-center gap-1 text-orange-600">
                  <Clock className="w-3.5 h-3.5" /> 18:45 remaining
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-slate-900 leading-snug mb-5">
                {questions[currentQuestionIdx]?.question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestionIdx]?.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs ring-2 ring-orange-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          {!submitted ? (
            <>
              <button
                onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  currentQuestionIdx === 0 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs shadow-emerald-600/20 active:scale-95"
                >
                  Submit Assessment
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={() => setActiveQuizModal(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
