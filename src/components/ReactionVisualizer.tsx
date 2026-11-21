import React, { useState } from 'react';
import { ArrowRight, Flame, Droplets, FlaskConical, Sparkles } from 'lucide-react';
import { Language, ReactionData } from '../types/chemistry';

interface ReactionVisualizerProps {
  reactions: ReactionData[];
  symbol: string;
  accentHex: string;
  lang: Language;
}

export const ReactionVisualizer: React.FC<ReactionVisualizerProps> = ({
  reactions,
  symbol,
  accentHex,
  lang,
}) => {
  const [activeId, setActiveId] = useState<string>(reactions[0]?.id ?? '');
  const activeReaction = reactions.find((r) => r.id === activeId) || reactions[0];

  const getIcon = (type: ReactionData['reactantType']) => {
    switch (type) {
      case 'oxygen':
        return <Flame className="w-4 h-4" />;
      case 'water':
        return <Droplets className="w-4 h-4" />;
      case 'acid':
        return <FlaskConical className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  if (!activeReaction) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Reaction Selector Tabs */}
      <div className="border-b border-slate-200 bg-slate-50 p-2 flex flex-wrap gap-1.5">
        {reactions.map((rxn) => {
          const isActive = rxn.id === activeReaction.id;
          return (
            <button
              key={rxn.id}
              type="button"
              onClick={() => setActiveId(rxn.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span style={isActive ? { color: '#ffffff' } : { color: accentHex }}>
                {getIcon(rxn.reactantType)}
              </span>
              <span>{rxn.title[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Reaction Stage */}
      <div key={activeReaction.id} className="p-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Animated Scientific Reaction Diagram */}
          <div className="lg:col-span-5 rounded-xl bg-slate-950 border border-slate-800 p-5 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>{activeReaction.conditions[lang]}</span>
              <span className="font-mono text-slate-300">{symbol}</span>
            </div>

            <svg viewBox="0 0 320 140" className="w-full h-auto" aria-hidden="true">
              {/* Reactant Atom Node */}
              <circle cx="58" cy="70" r="28" fill={accentHex} opacity="0.22" stroke={accentHex} strokeWidth="2" />
              <text x="58" y="75" textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {symbol}
              </text>

              {/* Co-reactant Node */}
              <circle cx="132" cy="70" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <text x="132" y="74" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                {activeReaction.reactantType === 'oxygen'
                  ? 'O₂'
                  : activeReaction.reactantType === 'water'
                    ? 'H₂O'
                    : activeReaction.reactantType === 'acid'
                      ? 'H⁺/Cl⁻'
                      : 'Reagent'}
              </text>

              {/* Animated Electron / Reaction Transfer Arrow */}
              <line x1="162" y1="70" x2="212" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="212,65 224,70 212,75" fill={accentHex} />

              {/* Animated electron pulse */}
              <circle r="3.5" fill="#38bdf8">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 86 70 L 220 70" />
              </circle>

              {/* Product Cluster */}
              <rect x="232" y="38" width="76" height="64" rx="12" fill={accentHex} opacity="0.16" stroke={accentHex} strokeWidth="1.8" />
              <text x="270" y="66" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {activeReaction.equation.split('→')[1]?.trim().split('+')[0]?.trim() || symbol}
              </text>
              <text x="270" y="84" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                {activeReaction.equation.includes('H₂↑') ? '+ H₂↑' : activeReaction.equation.includes('↓') ? '↓ ppt' : 'ΔH'}
              </text>
            </svg>

            <p className="mt-3 text-xs text-slate-300 leading-snug">
              {activeReaction.visualEffect[lang]}
            </p>
          </div>

          {/* Equation & Simple Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1.5">
                {lang === 'kz' ? 'Теңестірілген химиялық реакция теңдеуі' : 'Уравнение химической реакции'}
              </p>
              <div className="inline-flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-base sm:text-lg font-semibold text-slate-900">
                <span>{activeReaction.equation}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h5 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" style={{ color: accentHex }} />
                <span>{lang === 'kz' ? 'Қарапайым тілмен түсіндірме' : 'Объяснение простыми словами'}</span>
              </h5>
              <p className="text-sm leading-relaxed text-slate-700">
                {activeReaction.simpleExplanation[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
