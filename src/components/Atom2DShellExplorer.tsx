import React, { useEffect, useState } from 'react';
import { Atom, CircleDot, Info, Pause, Play } from 'lucide-react';
import { ElementData, IsotopeInfo, Language } from '../types/chemistry';
import { UI_TEXT } from '../data/uiTranslations';

interface Atom2DShellExplorerProps {
  element: ElementData;
  lang: Language;
}

const SHELL_LETTERS = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)', 'O (n=5)', 'P (n=6)'];
const SHELL_MAX_CAP = [2, 8, 18, 32, 32, 32];

export const Atom2DShellExplorer: React.FC<Atom2DShellExplorerProps> = ({ element, lang }) => {
  const [selectedShell, setSelectedShell] = useState<number>(element.block === 'f' ? 3 : 5);
  const [animateShells, setAnimateShells] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);

  const allIsotopes: IsotopeInfo[] = [
    element.atomicStructure.featuredIsotope,
    ...element.atomicStructure.alternativeIsotopes,
  ];
  const [selectedIsotopeMass, setSelectedIsotopeMass] = useState<number>(
    element.atomicStructure.featuredIsotope.massNumber
  );

  useEffect(() => {
    setSelectedIsotopeMass(element.atomicStructure.featuredIsotope.massNumber);
    setSelectedShell(element.block === 'f' ? 3 : 5);
  }, [element]);

  useEffect(() => {
    if (!animateShells) return;
    let rafId = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotationAngle((prev) => (prev + dt * 28) % 3600);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [animateShells]);

  const activeIsotope =
    allIsotopes.find((iso) => iso.massNumber === selectedIsotopeMass) || allIsotopes[0];

  const getSubshellsForShell = (shellIdx: number): string => {
    switch (shellIdx) {
      case 0:
        return '1s²';
      case 1:
        return '2s² 2p⁶';
      case 2:
        return '3s² 3p⁶ 3d¹⁰';
      case 3: {
        const fCount = element.atomicStructure.shells[3] - 18;
        return fCount > 0 ? `4s² 4p⁶ 4d¹⁰ 4f${toSuperscript(fCount)}` : '4s² 4p⁶ 4d¹⁰';
      }
      case 4: {
        const dCount = element.atomicStructure.shells[4] - 8;
        return dCount > 0 ? `5s² 5p⁶ 5d${toSuperscript(dCount)}` : '5s² 5p⁶';
      }
      case 5:
        return `6s${toSuperscript(element.atomicStructure.shells[5])}`;
      default:
        return '';
    }
  };

  // Generate deterministic nucleon positions for the interactive nucleus diagram
  const totalNucleons = activeIsotope.protons + activeIsotope.neutrons;
  const nucleonDots = Array.from({ length: totalNucleons }, (_, idx) => {
    const golden = idx * 2.39996323;
    const rad = 4 + Math.sqrt((idx + 0.5) / totalNucleons) * 44;
    const x = 110 + Math.cos(golden) * rad;
    const y = 110 + Math.sin(golden) * rad;
    return { x, y, idx };
  });
  // Ensure exact proton/neutron visual ratio
  const exactDots = nucleonDots.map((d, i) => ({
    ...d,
    type: i < activeIsotope.protons ? 'proton' : 'neutron',
  }));
  // Shuffle deterministically so protons and neutrons are mixed evenly inside nucleus
  exactDots.sort((a, b) => ((a.idx * 37) % 97) - ((b.idx * 37) % 97));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Animated 2D Bohr Electron Shell Diagram */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-display text-base font-semibold text-slate-900 flex items-center gap-2">
              <Atom className="w-4 h-4" style={{ color: element.theme.accentHex }} />
              <span>{UI_TEXT.atomModel.tabShells[lang]}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{UI_TEXT.atomModel.selectShellHint[lang]}</p>
          </div>
          <button
            type="button"
            onClick={() => setAnimateShells((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          >
            {animateShells ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{animateShells ? UI_TEXT.atomModel.pause[lang] : UI_TEXT.atomModel.play[lang]}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Interactive SVG Concentric Shells */}
          <div className="w-full max-w-[330px] aspect-square shrink-0">
            <svg viewBox="0 0 360 360" className="w-full h-full select-none">
              {/* Nucleus Center */}
              <circle cx="180" cy="180" r="22" fill={element.theme.accentHex} />
              <text
                x="180"
                y="177"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
              >
                {element.symbol}
              </text>
              <text
                x="180"
                y="190"
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                +{element.atomicNumber}
              </text>

              {/* 6 Electron Shells */}
              {element.atomicStructure.shells.map((electronCount, sIdx) => {
                const radius = 38 + sIdx * 23;
                const isSelected = selectedShell === sIdx;
                const dir = sIdx % 2 === 0 ? 1 : -1;
                const speedFactor = 1.6 / (1 + sIdx * 0.35);
                const shellDeg = rotationAngle * dir * speedFactor;

                return (
                  <g
                    key={sIdx}
                    onClick={() => setSelectedShell(sIdx)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="180"
                      cy="180"
                      r={radius}
                      fill="none"
                      stroke={isSelected ? element.theme.accentHex : '#cbd5e1'}
                      strokeWidth={isSelected ? 2.2 : 1.1}
                      strokeDasharray={isSelected ? undefined : '4 3'}
                    />
                    {/* Invisible wider hit ring */}
                    <circle cx="180" cy="180" r={radius} fill="none" stroke="transparent" strokeWidth="12" />

                    {/* Electrons */}
                    {Array.from({ length: electronCount }, (_, eIdx) => {
                      const angleRad = ((eIdx / electronCount) * 360 + shellDeg) * (Math.PI / 180);
                      const ex = 180 + Math.cos(angleRad) * radius;
                      const ey = 180 + Math.sin(angleRad) * radius;
                      return (
                        <circle
                          key={eIdx}
                          cx={ex}
                          cy={ey}
                          r={isSelected ? 4.1 : 3.2}
                          fill={isSelected ? element.theme.accentHex : '#0f172a'}
                          stroke="#ffffff"
                          strokeWidth="0.9"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Shell Selector & Breakdown */}
          <div className="w-full space-y-2">
            {element.atomicStructure.shells.map((count, idx) => {
              const isSelected = selectedShell === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedShell(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors flex items-center justify-between gap-2 text-xs ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-semibold whitespace-nowrap">{SHELL_LETTERS[idx]}</span>
                    <span className={`font-mono truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {getSubshellsForShell(idx)}
                    </span>
                  </div>
                  <span className="font-mono font-semibold tabular-nums shrink-0">
                    {count} / {SHELL_MAX_CAP[idx]} e⁻
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <span>{element.atomicStructure.orbitalFillingNote[lang]}</span>
        </div>
      </div>

      {/* Right: Interactive Nucleus & Isotope Inspector */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <h4 className="font-display text-base font-semibold text-slate-900 flex items-center gap-2">
            <CircleDot className="w-4 h-4" style={{ color: element.theme.accentHex }} />
            <span>{UI_TEXT.atomModel.tabNucleus[lang]}</span>
          </h4>

          {/* Isotope Selector */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {allIsotopes.map((iso) => {
              const active = iso.massNumber === activeIsotope.massNumber;
              return (
                <button
                  key={iso.massNumber}
                  type="button"
                  onClick={() => setSelectedIsotopeMass(iso.massNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors border ${
                    active
                      ? 'text-white border-transparent'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={active ? { backgroundColor: element.theme.accentHex } : undefined}
                >
                  {iso.massNumber}{element.symbol} ({iso.naturalAbundance})
                </button>
              );
            })}
          </div>

          {/* Nucleus Visual */}
          <div className="mt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
            <div className="w-44 h-44 shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <svg viewBox="0 0 220 220" className="w-full h-full">
                <circle cx="110" cy="110" r="68" fill={element.theme.accentHex} opacity="0.1" />
                {exactDots.map((dot, i) => (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r="4.2"
                    fill={dot.type === 'proton' ? element.theme.accentHex : '#94a3b8'}
                    stroke="#0f172a"
                    strokeWidth="0.7"
                  />
                ))}
              </svg>
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: element.theme.accentHex }} />
                  {UI_TEXT.labels.protons[lang]}
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900">{activeIsotope.protons}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  {UI_TEXT.labels.neutrons[lang]}
                </span>
                <span className="font-mono font-bold tabular-nums text-slate-900">{activeIsotope.neutrons}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{UI_TEXT.labels.electrons[lang]}</span>
                <span className="font-mono font-bold tabular-nums text-slate-900">{activeIsotope.electrons}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600">{UI_TEXT.labels.nuclearCharge[lang]}</span>
                <span className="font-mono font-bold tabular-nums text-slate-900">+{activeIsotope.protons}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 pt-3 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
          {activeIsotope.note[lang]}
        </p>
      </div>
    </div>
  );
};

function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return String(num)
    .split('')
    .map((c) => map[c] || c)
    .join('');
}
