import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Language } from '../types/chemistry';
import { UI_TEXT } from '../data/uiTranslations';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  lang,
  onChangeLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: UI_TEXT.nav.home[lang] },
    { path: '/periodic-table', label: UI_TEXT.nav.periodicTable[lang] },
    { path: '/compare', label: UI_TEXT.nav.compare[lang] },
    { path: '/quiz', label: UI_TEXT.nav.quiz[lang] },
  ];

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          {lang === 'kz' ? 'ХИМИЯЛЫҚ ЭЛЕМЕНТТЕР ӘЛЕМІ' : 'МИР ХИМИЧЕСКИХ ЭЛЕМЕНТОВ'}
        </a>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-slate-900 border-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action — KZ / RU Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => onChangeLang('kz')}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'kz'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              KZ
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'ru'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RU
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};
