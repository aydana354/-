import React, { useState } from 'react';
import { ELEMENTS_LIST, GLOBAL_QUIZ_QUESTIONS } from '../data/elementsIndex';
import { ElementQuiz } from '../components/ElementQuiz';
import { ElementId, Language } from '../types/chemistry';

interface QuizPageProps {
  lang: Language;
}

type QuizTab = 'all' | ElementId;

export const QuizPage: React.FC<QuizPageProps> = ({ lang }) => {
  const [selectedTab, setSelectedTab] = useState<QuizTab>('all');

  const selectedElement =
    selectedTab === 'all'
      ? null
      : ELEMENTS_LIST.find((e) => e.id === selectedTab) || null;

  const activeQuestions = selectedElement
    ? selectedElement.quiz
    : GLOBAL_QUIZ_QUESTIONS;

  const activeTitle = selectedElement
    ? `${selectedElement.atomicNumber} ${selectedElement.symbol} — ${selectedElement.names[lang]}`
    : lang === 'kz'
      ? 'Жалпы энциклопедиялық викторина (15 сұрақ)'
      : 'Общая итоговая викторина по 5 элементам (15 вопросов)';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          {lang === 'kz'
            ? 'Интерактивті химиялық викторина'
            : 'Интерактивная химическая викторина'}
        </h1>
        <p className="mt-2 text-base text-slate-600 leading-relaxed">
          {lang === 'kz'
            ? 'Барлық бес элемент (Ba, La, Ce, Pr, Nd) бойынша жалпы білім тексеру немесе жеке элементтің 10 сұрақтан тұратын тестін таңдаңыз.'
            : 'Выберите общую викторину по всем пяти элементам и редкоземельным металлам или пройдите углублённый тест из 10 вопросов по конкретному элементу.'}
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => setSelectedTab('all')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selectedTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang === 'kz' ? 'Жалпы тест (15)' : 'Общая викторина (15)'}
        </button>
        {ELEMENTS_LIST.map((el) => {
          const active = selectedTab === el.id;
          return (
            <button
              key={el.id}
              type="button"
              onClick={() => setSelectedTab(el.id)}
              style={active ? { backgroundColor: el.theme.accentHex } : undefined}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                active ? 'text-white shadow-sm font-semibold' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {el.symbol} — {el.names[lang]} (10)
            </button>
          );
        })}
      </div>

      <ElementQuiz
        questions={activeQuestions}
        title={activeTitle}
        accentHex={selectedElement?.theme.accentHex || '#0f172a'}
        lang={lang}
      />
    </div>
  );
};
