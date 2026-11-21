/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ElementId, Language } from './types/chemistry';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PeriodicTablePage } from './pages/PeriodicTablePage';
import { ComparePage } from './pages/ComparePage';
import { QuizPage } from './pages/QuizPage';
import { ElementDetailPage } from './pages/ElementDetailPage';

const VALID_ELEMENT_IDS: ElementId[] = ['ba', 'la', 'ce', 'pr', 'nd'];

function normalizePath(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  return cleaned.toLowerCase();
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('chem_encyclopedia_lang');
      if (saved === 'kz' || saved === 'ru') return saved;
    } catch {
      // ignore storage access issues
    }
    return 'ru';
  });

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
    try {
      localStorage.setItem('chem_encyclopedia_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const handleNavigate = (path: string) => {
    const normalized = normalizePath(path);
    if (normalized !== currentPath) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={handleNavigate} lang={lang} />;
    }
    if (currentPath === '/periodic-table') {
      return <PeriodicTablePage onNavigate={handleNavigate} lang={lang} />;
    }
    if (currentPath === '/compare') {
      return <ComparePage onNavigate={handleNavigate} lang={lang} />;
    }
    if (currentPath === '/quiz') {
      return <QuizPage lang={lang} />;
    }

    // Match /element/ba, /element/la, /element/ce, /element/pr, /element/nd
    const elementMatch = currentPath.match(/^\/element\/([a-z]+)$/);
    if (elementMatch) {
      const id = elementMatch[1] as ElementId;
      if (VALID_ELEMENT_IDS.includes(id)) {
        return <ElementDetailPage elementId={id} onNavigate={handleNavigate} lang={lang} />;
      }
    }

    // Fallback to HomePage for unknown paths
    return <HomePage onNavigate={handleNavigate} lang={lang} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        lang={lang}
        onChangeLang={setLang}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} lang={lang} />
    </div>
  );
}
