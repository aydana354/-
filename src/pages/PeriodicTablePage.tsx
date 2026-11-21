import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../data/periodicTableData';
import { ELEMENTS_MAP } from '../data/elementsIndex';
import { UI_TEXT } from '../data/uiTranslations';
import { Language, PeriodicElementCell } from '../types/chemistry';

interface PeriodicTablePageProps {
  onNavigate: (path: string) => void;
  lang: Language;
}

type FilterMode = 'all' | 'featured' | 'alkaline' | 'lanthanides';

const CATEGORY_LABELS: Record<PeriodicElementCell['category'], { kz: string; ru: string; bg: string; border: string; text: string }> = {
  alkali: { kz: 'Сілтілік металдар', ru: 'Щелочные металлы', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900' },
  alkaline: { kz: 'Сілтілік жер металдары', ru: 'Щёлочноземельные металлы', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900' },
  transition: { kz: 'Өтпелі металдар (d)', ru: 'Переходные металлы (d)', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900' },
  'post-transition': { kz: 'Өтпеліден кейінгі металдар', ru: 'Постпереходные металлы', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800' },
  metalloid: { kz: 'Металлоидтар', ru: 'Металлоиды', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900' },
  nonmetal: { kz: 'Бейметалдар', ru: 'Неметаллы', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
  noble: { kz: 'Инертті газдар', ru: 'Благородные газы', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900' },
  lanthanide: { kz: 'Лантаноидтар', ru: 'Лантаноиды', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900' },
  actinide: { kz: 'Актиноидтар', ru: 'Актиноиды', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
};

export const PeriodicTablePage: React.FC<PeriodicTablePageProps> = ({ onNavigate, lang }) => {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectedCell, setSelectedCell] = useState<PeriodicElementCell>(
    PERIODIC_ELEMENTS.find((e) => e.number === 56) || PERIODIC_ELEMENTS[0]
  );

  const isCellHighlighted = (cell: PeriodicElementCell): boolean => {
    if (filter === 'all') return true;
    if (filter === 'featured') return Boolean(cell.featuredId);
    if (filter === 'alkaline') return cell.category === 'alkaline';
    if (filter === 'lanthanides') return cell.category === 'lanthanide';
    return true;
  };

  const featuredElementData = selectedCell.featuredId
    ? ELEMENTS_MAP[selectedCell.featuredId]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
            {UI_TEXT.periodicPage.title[lang]}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {UI_TEXT.periodicPage.subtitle[lang]}
          </p>
        </div>

        {/* Interactive Filter Segmented Control */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
          {(
            [
              { id: 'all', label: UI_TEXT.periodicPage.filterAll[lang] },
              { id: 'featured', label: UI_TEXT.periodicPage.filterFeatured[lang] },
              { id: 'alkaline', label: UI_TEXT.periodicPage.filterAlkaline[lang] },
              { id: 'lanthanides', label: UI_TEXT.periodicPage.filterLanthanides[lang] },
            ] as { id: FilterMode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Element Quick Inspector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-display text-white shrink-0"
              style={{
                backgroundColor: featuredElementData
                  ? featuredElementData.theme.accentHex
                  : '#0f172a',
              }}
            >
              <span className="font-mono text-[10px] opacity-80 tabular-nums">{selectedCell.number}</span>
              <span className="text-2xl font-extrabold leading-none">{selectedCell.symbol}</span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span>Z = {selectedCell.number}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Ar = {selectedCell.mass}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedCell.block}-block</span>
                <span aria-hidden="true">·</span>
                <span>{CATEGORY_LABELS[selectedCell.category][lang]}</span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                {lang === 'kz' ? selectedCell.nameKz : selectedCell.nameRu}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({lang === 'kz' ? selectedCell.nameRu : selectedCell.nameKz})
                </span>
              </h2>
              {featuredElementData ? (
                <p className="text-sm text-slate-600">{featuredElementData.tagline[lang]}</p>
              ) : (
                <p className="text-xs text-slate-500">{UI_TEXT.periodicPage.clickPrompt[lang]}</p>
              )}
            </div>
          </div>

          {featuredElementData && (
            <button
              type="button"
              onClick={() => onNavigate(`/element/${featuredElementData.id}`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: featuredElementData.theme.accentHex }}
            >
              <span>{UI_TEXT.home.openElementPage[lang]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 18-Column Periodic Table Grid (Horizontal scroll on smaller screens for perfect geometry) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 overflow-x-auto">
        <div
          className="min-w-[920px] grid gap-1.5"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(7, auto) 14px repeat(2, auto)',
          }}
        >
          {PERIODIC_ELEMENTS.map((cell) => {
            const highlighted = isCellHighlighted(cell);
            const featured = cell.featuredId ? ELEMENTS_MAP[cell.featuredId] : null;
            const isSelected = selectedCell.number === cell.number;
            const catStyle = CATEGORY_LABELS[cell.category];

            return (
              <button
                key={cell.number}
                type="button"
                onClick={() => {
                  setSelectedCell(cell);
                  if (featured && isSelected) {
                    onNavigate(`/element/${featured.id}`);
                  }
                }}
                onDoubleClick={() => {
                  if (featured) onNavigate(`/element/${featured.id}`);
                }}
                style={{
                  gridColumn: cell.col,
                  gridRow: cell.row,
                  ...(featured
                    ? {
                        backgroundColor: featured.theme.accentHex,
                        borderColor: featured.theme.accentDarkHex,
                        color: '#ffffff',
                      }
                    : {}),
                }}
                className={`relative rounded-lg border p-1.5 text-left transition-all flex flex-col justify-between min-h-[54px] ${
                  featured
                    ? 'shadow-sm ring-offset-1 hover:scale-[1.04] z-10'
                    : `${catStyle.bg} ${catStyle.border} ${catStyle.text} hover:border-slate-500`
                } ${!highlighted ? 'opacity-25' : 'opacity-100'} ${
                  isSelected ? 'ring-2 ring-slate-900 z-20' : ''
                }`}
                title={`${cell.number} ${cell.symbol} — ${lang === 'kz' ? cell.nameKz : cell.nameRu}`}
              >
                <span
                  className={`font-mono text-[9px] leading-none tabular-nums ${
                    featured ? 'text-white/90 font-semibold' : 'opacity-70'
                  }`}
                >
                  {cell.number}
                </span>
                <span className="font-display text-sm font-bold leading-tight text-center my-0.5">
                  {cell.symbol}
                </span>
                <span
                  className={`text-[8px] leading-none truncate text-center ${
                    featured ? 'text-white/90 font-medium' : 'opacity-75'
                  }`}
                >
                  {lang === 'kz' ? cell.nameKz : cell.nameRu}
                </span>
              </button>
            );
          })}

          {/* Placeholders in Period 6 Col 3 and Period 7 Col 3 */}
          <div
            style={{ gridColumn: 3, gridRow: 6 }}
            className="rounded-lg border border-dashed border-violet-300 bg-violet-50/60 p-1 flex flex-col items-center justify-center text-center text-[9px] font-mono text-violet-800"
          >
            <span>57–71</span>
            <span>La–Lu</span>
          </div>
          <div
            style={{ gridColumn: 3, gridRow: 7 }}
            className="rounded-lg border border-dashed border-orange-300 bg-orange-50/60 p-1 flex flex-col items-center justify-center text-center text-[9px] font-mono text-orange-800"
          >
            <span>89–103</span>
            <span>Ac–Lr</span>
          </div>

          {/* Row labels for Lanthanides / Actinides */}
          <div
            style={{ gridColumn: '1 / 3', gridRow: 9 }}
            className="flex items-center justify-end pr-2 text-[11px] font-medium text-slate-600"
          >
            {UI_TEXT.periodicPage.lanthanidesLabel[lang]}
          </div>
          <div
            style={{ gridColumn: '1 / 3', gridRow: 10 }}
            className="flex items-center justify-end pr-2 text-[11px] font-medium text-slate-600"
          >
            {UI_TEXT.periodicPage.actinidesLabel[lang]}
          </div>
        </div>
      </div>

      {/* Featured 5 Elements Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['ba', 'la', 'ce', 'pr', 'nd'] as const).map((id) => {
          const el = ELEMENTS_MAP[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(`/element/${id}`)}
              className="rounded-xl border border-slate-200 bg-white hover:border-slate-400 p-3.5 text-left transition-colors flex items-center justify-between gap-2"
            >
              <div>
                <div className="font-mono text-xs text-slate-500 tabular-nums">
                  {el.atomicNumber} · {el.block}
                </div>
                <div className="font-display text-base font-bold text-slate-900">
                  {el.symbol} — {el.names[lang]}
                </div>
              </div>
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: el.theme.accentHex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
