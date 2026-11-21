import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, Grid, Scale, HelpCircle } from 'lucide-react';
import { ELEMENTS_LIST, HERO_IMAGE_URL } from '../data/elementsIndex';
import { UI_TEXT } from '../data/uiTranslations';
import { Language } from '../types/chemistry';
import { ResilientImage } from '../components/ResilientImage';

interface HomePageProps {
  onNavigate: (path: string) => void;
  lang: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, lang }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string) => {
    const fullUrl = `${window.location.origin}/element/${id}`;
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section: Asymmetric Split on Desktop */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-mono tracking-wide text-slate-400">
                {UI_TEXT.hero.kicker[lang]}
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.12] text-white text-balance">
                {UI_TEXT.projectTitle.kz}
                <span className="block text-slate-300 mt-1.5 text-2xl sm:text-3xl font-bold">
                  {UI_TEXT.projectTitle.ru}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                {UI_TEXT.projectSubtitle[lang]}
              </p>

              {/* Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#elements-grid"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('elements-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  <span>{UI_TEXT.hero.ctaExplore[lang]}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('/periodic-table')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <Grid className="w-4 h-4 text-slate-300" />
                  <span>{UI_TEXT.hero.ctaTable[lang]}</span>
                </button>
              </div>

              {/* Quick 5-Element Number Strip */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-5 gap-2 max-w-md">
                {ELEMENTS_LIST.map((el) => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => onNavigate(`/element/${el.id}`)}
                    className="group rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-600 p-2 text-left transition-colors"
                  >
                    <div className="font-mono text-[11px] text-slate-400 tabular-nums">{el.atomicNumber}</div>
                    <div
                      className="font-display text-lg font-bold leading-tight"
                      style={{ color: el.theme.orbitColorHex }}
                    >
                      {el.symbol}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 lg:h-full min-h-[280px]">
                <img
                  src={HERO_IMAGE_URL}
                  alt={UI_TEXT.hero.heroImageCaption[lang]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent"
                  aria-hidden="true"
                />
                <p className="absolute bottom-4 left-4 right-4 text-xs text-slate-200 leading-snug">
                  {UI_TEXT.hero.heroImageCaption[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Featured Elements Showcase */}
      <section id="elements-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-3xl mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
            {UI_TEXT.home.fiveElementsTitle[lang]}
          </h2>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            {UI_TEXT.home.fiveElementsSubtitle[lang]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ELEMENTS_LIST.map((el) => (
            <article
              key={el.id}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between transition-all hover:border-slate-400"
            >
              <div>
                {/* Top specimen visual */}
                <div className="p-4 pb-0">
                  <ResilientImage
                    asset={el.visuals.pureSample}
                    symbol={el.symbol}
                    atomicNumber={el.atomicNumber}
                    accentHex={el.theme.accentHex}
                    lang={lang}
                    aspectClass="aspect-[16/10]"
                  />
                </div>

                {/* Element Identity */}
                <div className="p-5 pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span className="tabular-nums">Z = {el.atomicNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{el.atomicMassDisplay}</span>
                        <span aria-hidden="true">·</span>
                        <span>{el.block}-block</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                        {el.names[lang]}
                        <span className="ml-2 text-sm font-normal text-slate-500">({el.names.en})</span>
                      </h3>
                    </div>

                    <div
                      className="w-13 h-13 rounded-xl flex items-center justify-center font-display text-2xl font-extrabold text-white shrink-0"
                      style={{ backgroundColor: el.theme.accentHex }}
                    >
                      {el.symbol}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {el.tagline[lang]}
                  </p>

                  {/* Key Numerical Metrics Strip */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-400">{lang === 'kz' ? 'Конфигурация' : 'Конфигурация'}</span>
                      <span className="font-mono font-semibold text-slate-800">{el.atomicStructure.electronConfigShort}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">{lang === 'kz' ? 'Тығыздығы' : 'Плотность'}</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-800">{el.physicalProperties.densityGcm3} г/см³</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">{lang === 'kz' ? 'Балқу t°' : 'Т. пл.'}</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-800">{el.physicalProperties.meltingPointC} °C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="px-5 pb-5">
                <a
                  href={`/element/${el.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/element/${el.id}`);
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>{UI_TEXT.home.openElementPage[lang]}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}

          {/* 6th Grid Card: Direct Navigation to Comparative Table & Quiz */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-mono text-slate-400">
                {lang === 'kz' ? 'Жүйелі талдау және бақылау' : 'Системный анализ и проверка'}
              </p>
              <h3 className="font-display text-2xl font-bold leading-snug">
                {lang === 'kz'
                  ? 'Салыстырмалы кесте, СЖЭ теориясы және викторина'
                  : 'Сводное сравнение, редкоземельные металлы и викторина'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'kz'
                  ? 'Неліктен La–Nd сирек жер элементтеріне жатады, неодим магниттерінің күші неде және Ba мен лантаноидтардың айырмашылығы қандай — барлығы бір бетте.'
                  : 'Подробный разбор лантаноидов, природы силы неодимовых магнитов, отличий Ba от La–Nd и экологии добычи РЗЭ.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-6">
              <button
                type="button"
                onClick={() => onNavigate('/compare')}
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  <span>{UI_TEXT.nav.compare[lang]}</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/quiz')}
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{UI_TEXT.nav.quiz[lang]}</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Connection Callout (82-Neutron Isotones) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2.5">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {UI_TEXT.home.isotoneBridgeTitle[lang]}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {UI_TEXT.home.isotoneBridgeBody[lang]}
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-5 gap-2">
              {ELEMENTS_LIST.map((el) => (
                <div
                  key={el.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center"
                >
                  <div className="font-mono text-xs text-slate-500 tabular-nums">
                    <sup>{el.atomicStructure.featuredIsotope.massNumber}</sup>
                    {el.symbol}
                  </div>
                  <div
                    className="font-mono text-sm font-bold tabular-nums mt-1"
                    style={{ color: el.theme.accentHex }}
                  >
                    {el.atomicStructure.featuredIsotope.neutrons} n⁰
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {el.atomicStructure.protons} p⁺
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QR-Ready Permanent Routes & Author Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR-Ready Permanent URLs */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {UI_TEXT.home.qrDirectoryTitle[lang]}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {UI_TEXT.home.qrDirectoryDesc[lang]}
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {ELEMENTS_LIST.map((el) => {
                const path = `/element/${el.id}`;
                const isCopied = copiedId === el.id;
                return (
                  <div
                    key={el.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: el.theme.accentHex }}
                      >
                        {el.symbol}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">
                          {el.atomicNumber} {el.names[lang]}
                        </div>
                        <div className="font-mono text-xs text-slate-500 truncate">{path}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(el.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? UI_TEXT.home.copiedUrl[lang] : UI_TEXT.home.copyUrl[lang]}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(path)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        <span>{lang === 'kz' ? 'Ашу' : 'Открыть'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandatory Project Author Block */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs font-mono tracking-wide text-slate-400">
                {UI_TEXT.authorCombined.ru}
              </p>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {UI_TEXT.authorName}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {lang === 'kz'
                  ? '«ХИМИЯЛЫҚ ЭЛЕМЕНТТЕР ӘЛЕМІ / МИР ХИМИЧЕСКИХ ЭЛЕМЕНТОВ» — 56–60 реттік нөмірлі элементтерді (Ba, La, Ce, Pr, Nd) қазақ және орыс тілдерінде 3D-модельдермен, реакциялармен және тесттермен зерттеуге арналған заманауи білім беру веб-энциклопедиясы.'
                  : '«ХИМИЯЛЫҚ ЭЛЕМЕНТТЕР ӘЛЕМІ / МИР ХИМИЧЕСКИХ ЭЛЕМЕНТОВ» — двуязычная научная веб-энциклопедия по элементам № 56–60 (Ba, La, Ce, Pr, Nd) с интерактивными 3D-моделями атомов, схемами реакций и проверочными тестами.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 text-xs text-slate-400">
              {UI_TEXT.labels.sourcesNote[lang]}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
