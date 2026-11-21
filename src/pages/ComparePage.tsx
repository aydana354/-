import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ELEMENTS_LIST, RARE_EARTH_ESSAYS } from '../data/elementsIndex';
import { UI_TEXT } from '../data/uiTranslations';
import { Language } from '../types/chemistry';

interface ComparePageProps {
  onNavigate: (path: string) => void;
  lang: Language;
}

type ChartMetric = 'density' | 'melting' | 'boiling' | 'abundance' | 'radius';

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate, lang }) => {
  const [metric, setMetric] = useState<ChartMetric>('density');

  const metricConfig: Record<
    ChartMetric,
    {
      label: { kz: string; ru: string };
      unit: string;
      getValue: (el: (typeof ELEMENTS_LIST)[number]) => number;
    }
  > = {
    density: {
      label: { kz: 'Тығыздығы', ru: 'Плотность' },
      unit: 'г/см³',
      getValue: (el) => el.physicalProperties.densityGcm3,
    },
    melting: {
      label: { kz: 'Балқу температурасы', ru: 'Температура плавления' },
      unit: '°C',
      getValue: (el) => el.physicalProperties.meltingPointC,
    },
    boiling: {
      label: { kz: 'Қайнау температурасы', ru: 'Температура кипения' },
      unit: '°C',
      getValue: (el) => el.physicalProperties.boilingPointC,
    },
    abundance: {
      label: { kz: 'Жер қыртысындағы мөлшері', ru: 'Содержание в земной коре' },
      unit: 'ppm (г/т)',
      getValue: (el) => el.naturalOccurrence.crustalPpm,
    },
    radius: {
      label: { kz: 'Атомдық радиусы', ru: 'Атомный радиус' },
      unit: 'пм',
      getValue: (el) => el.physicalProperties.atomicRadiusPm,
    },
  };

  const activeMetric = metricConfig[metric];
  const maxVal = Math.max(...ELEMENTS_LIST.map((el) => activeMetric.getValue(el)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
          {UI_TEXT.comparePage.title[lang]}
        </h1>
        <p className="mt-2 text-base text-slate-600 leading-relaxed">
          {UI_TEXT.comparePage.subtitle[lang]}
        </p>
      </div>

      {/* Comparative Bar Chart */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {UI_TEXT.comparePage.metricSelector[lang]} {activeMetric.label[lang]}
          </h2>
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(Object.keys(metricConfig) as ChartMetric[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  metric === key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {metricConfig[key].label[lang]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3.5">
          {ELEMENTS_LIST.map((el) => {
            const val = activeMetric.getValue(el);
            const widthPct = Math.max(8, Math.round((val / maxVal) * 100));
            return (
              <div key={el.id} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-4 sm:col-span-3 flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: el.theme.accentHex }}
                  >
                    {el.symbol}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {el.names[lang]}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                      Z = {el.atomicNumber}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 sm:col-span-7">
                  <div className="w-full h-7 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-300"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: el.theme.accentHex,
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-2 text-right font-mono text-sm font-semibold tabular-nums text-slate-900">
                  {val} <span className="text-xs font-normal text-slate-500">{activeMetric.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Master Comparative Table */}
      <section className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
          {UI_TEXT.comparePage.tableTitle[lang]}
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">{lang === 'kz' ? 'Сипаттама' : 'Характеристика'}</th>
                {ELEMENTS_LIST.map((el) => (
                  <th key={el.id} className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/element/${el.id}`)}
                      className="inline-flex items-center gap-2 font-display text-sm font-bold text-slate-900 hover:underline"
                    >
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-mono"
                        style={{ backgroundColor: el.theme.accentHex }}
                      >
                        {el.symbol}
                      </span>
                      <span>{el.names[lang]}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.atomicNumber[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900">
                    {el.atomicNumber}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.atomicMass[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.atomicMassDisplay}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.group[lang]} / {UI_TEXT.labels.block[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 text-slate-800">
                    {el.groupDisplay[lang]} · <span className="font-mono font-semibold">{el.block}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.electronConfig[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono text-xs sm:text-sm text-slate-900">
                    {el.atomicStructure.electronConfigShort}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.shellDistribution[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700">
                    {el.atomicStructure.shells.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{lang === 'kz' ? 'Изотон (82 n⁰)' : 'Изотоп (82 n⁰)'}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono text-xs tabular-nums text-slate-800">
                    <sup>{el.atomicStructure.featuredIsotope.massNumber}</sup>
                    {el.symbol} ({el.atomicStructure.featuredIsotope.neutrons} n⁰)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.oxidationStates[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {el.atomicStructure.primaryOxidationState}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.density[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.physicalProperties.densityGcm3} г/см³
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.meltingPoint[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.physicalProperties.meltingPointC} °C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.boilingPoint[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.physicalProperties.boilingPointC} °C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.abundance[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.naturalOccurrence.crustalPpm} ppm
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-600">{UI_TEXT.labels.discoveryYear[lang]}</td>
                {ELEMENTS_LIST.map((el) => (
                  <td key={el.id} className="py-3 px-4 font-mono tabular-nums text-slate-800">
                    {el.discovery.year}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Special Section: Rare Earth Elements & Lanthanides Deep Dive */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            {UI_TEXT.comparePage.rareEarthTitle[lang]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RARE_EARTH_ESSAYS.map((essay, idx) => (
            <article
              key={essay.id}
              className={`rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 ${
                idx === RARE_EARTH_ESSAYS.length - 1 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="space-y-2.5">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {essay.title[lang]}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {essay.body[lang]}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-900">
                <span className="text-slate-500 mr-1.5">
                  {lang === 'kz' ? 'Қорытынды:' : 'Ключевой вывод:'}
                </span>
                {essay.keyTakeaway[lang]}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom links to explore elements */}
        <div className="flex flex-wrap gap-3 pt-2">
          {ELEMENTS_LIST.map((el) => (
            <button
              key={el.id}
              type="button"
              onClick={() => onNavigate(`/element/${el.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-slate-400 text-sm font-medium text-slate-800 transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: el.theme.accentHex }}
              />
              <span>
                {el.atomicNumber} {el.symbol} — {el.names[lang]}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
