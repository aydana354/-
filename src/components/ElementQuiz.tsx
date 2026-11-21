import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { Language, QuizQuestion } from '../types/chemistry';
import { UI_TEXT } from '../data/uiTranslations';

interface ElementQuizProps {
  questions: QuizQuestion[];
  title: string;
  accentHex?: string;
  lang: Language;
}

export const ElementQuiz: React.FC<ElementQuizProps> = ({
  questions,
  title,
  accentHex = '#0f172a',
  lang,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Reset quiz when question set changes (e.g. navigating between elements)
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  }, [questions]);

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(optionIdx);
    if (optionIdx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  };

  if (!currentQuestion) return null;

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const feedback =
      percentage >= 80
        ? UI_TEXT.quiz.excellent[lang]
        : percentage >= 50
          ? UI_TEXT.quiz.good[lang]
          : UI_TEXT.quiz.needsReview[lang];

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white mb-4"
          style={{ backgroundColor: accentHex }}
        >
          <Award className="w-7 h-7" />
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-900">{UI_TEXT.quiz.resultTitle[lang]}</h3>
        <p className="text-sm text-slate-500 mt-1">{title}</p>

        <div className="my-6 py-5 px-6 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col items-center">
          <div className="font-mono text-4xl font-bold tabular-nums text-slate-900">
            {score} / {questions.length}
          </div>
          <div className="font-mono text-sm text-slate-600 mt-1 tabular-nums">{percentage}%</div>
        </div>

        <p className="text-base text-slate-700 max-w-md mx-auto leading-relaxed">{feedback}</p>

        <button
          type="button"
          onClick={handleRetry}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentHex }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{UI_TEXT.quiz.retryQuiz[lang]}</span>
        </button>
      </div>
    );
  }

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQuestion.correctIndex;
  const progressPercent = ((currentIdx + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Top Quiz Bar */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm font-medium text-slate-700">
          {UI_TEXT.quiz.questionPrefix[lang]}{' '}
          <span className="font-mono font-bold tabular-nums text-slate-900">{currentIdx + 1}</span>{' '}
          {UI_TEXT.quiz.of[lang]}{' '}
          <span className="font-mono tabular-nums">{questions.length}</span>
        </div>
        <div className="text-sm font-medium text-slate-700">
          {UI_TEXT.quiz.score[lang]}:{' '}
          <span className="font-mono font-bold tabular-nums text-slate-900">{score}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-slate-100">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progressPercent}%`, backgroundColor: accentHex }}
        />
      </div>

      {/* Question & Options */}
      <div className="p-6 sm:p-8 space-y-6">
        <h4 className="font-display text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
          {currentQuestion.question[lang]}
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedOption === idx;
            const isRightOption = idx === currentQuestion.correctIndex;

            let optionClasses =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50';

            if (isAnswered) {
              if (isRightOption) {
                optionClasses = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
              } else if (isSelected && !isRightOption) {
                optionClasses = 'border-rose-600 bg-rose-50 text-rose-950';
              } else {
                optionClasses = 'border-slate-200 bg-slate-50/60 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${optionClasses}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-700 shrink-0">
                    {letter}
                  </span>
                  <span className="text-sm sm:text-base">{opt[lang]}</span>
                </div>
                {isAnswered && isRightOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isRightOption && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Verification & Explanation */}
        {isAnswered && (
          <div
            className={`rounded-xl border p-4 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-700" />
              )}
              <span>{isCorrect ? UI_TEXT.quiz.correct[lang] : UI_TEXT.quiz.incorrect[lang]}</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {currentQuestion.explanation[lang]}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentHex }}
              >
                <span>
                  {currentIdx + 1 < questions.length
                    ? UI_TEXT.quiz.nextQuestion[lang]
                    : UI_TEXT.quiz.finishQuiz[lang]}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
