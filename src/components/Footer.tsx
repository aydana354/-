import React from 'react';
import { ELEMENTS_LIST } from '../data/elementsIndex';
import { UI_TEXT } from '../data/uiTranslations';
import { Language } from '../types/chemistry';

interface FooterProps {
  onNavigate: (path: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-base font-bold text-slate-900">
              {UI_TEXT.projectTitle.kz} / {UI_TEXT.projectTitle.ru}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {UI_TEXT.projectSubtitle[lang]}
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {UI_TEXT.labels.sourcesNote[lang]}
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="text-xs font-semibold text-slate-900">
              {lang === 'kz' ? 'Элементтер беттері (QR-маршруттар)' : 'Страницы элементов (постоянные URL)'}
            </p>
            <ul className="grid grid-cols-1 gap-1.5 text-sm">
              {ELEMENTS_LIST.map((el) => (
                <li key={el.id}>
                  <a
                    href={`/element/${el.id}`}
                    onClick={(e) => handleLink(e, `/element/${el.id}`)}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: el.theme.accentHex }}
                    />
                    <span className="font-mono text-xs text-slate-500">{el.atomicNumber}</span>
                    <span className="font-semibold text-slate-800">{el.symbol}</span>
                    <span>— {el.names[lang]}</span>
                    <span className="font-mono text-xs text-slate-400">/element/{el.id}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="text-xs font-semibold text-slate-900">
              {lang === 'kz' ? 'Бөлімдер' : 'Разделы сайта'}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>
                <a href="/" onClick={(e) => handleLink(e, '/')} className="hover:text-slate-900">
                  {UI_TEXT.nav.home[lang]}
                </a>
              </li>
              <li>
                <a href="/periodic-table" onClick={(e) => handleLink(e, '/periodic-table')} className="hover:text-slate-900">
                  {UI_TEXT.nav.periodicTable[lang]}
                </a>
              </li>
              <li>
                <a href="/compare" onClick={(e) => handleLink(e, '/compare')} className="hover:text-slate-900">
                  {UI_TEXT.nav.compare[lang]}
                </a>
              </li>
              <li>
                <a href="/quiz" onClick={(e) => handleLink(e, '/quiz')} className="hover:text-slate-900">
                  {UI_TEXT.nav.quiz[lang]}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Author Attribution Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="text-slate-800">
            <span className="text-slate-500">{UI_TEXT.authorCombined[lang]}: </span>
            <span className="font-display font-bold text-slate-900">{UI_TEXT.authorName}</span>
          </div>
          <div className="text-xs text-slate-500">
            {lang === 'kz'
              ? 'Барлық беттер тікелей сілтеме арқылы ашылады · Ашық білім беру ресурсы'
              : 'Все страницы доступны по прямым ссылкам без авторизации · Образовательная энциклопедия'}
          </div>
        </div>
      </div>
    </footer>
  );
};
