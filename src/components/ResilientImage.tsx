import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { ElementVisualAsset, Language } from '../types/chemistry';
import { UI_TEXT } from '../data/uiTranslations';

interface ResilientImageProps {
  asset: ElementVisualAsset;
  symbol: string;
  atomicNumber: number;
  accentHex: string;
  lang: Language;
  aspectClass?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  asset,
  symbol,
  atomicNumber,
  accentHex,
  lang,
  aspectClass = 'aspect-[4/3]',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasImage = Boolean(asset.imageUrl) && !imgError;

  useEffect(() => {
    if (!isZoomed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isZoomed]);

  const renderFallbackArtwork = () => (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle at 30% 25%, ${accentHex}22 0%, #0f172a 72%)`,
      }}
    >
      {/* Subtle laboratory grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${symbol}-${asset.fallbackVariant}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#94a3b8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${symbol}-${asset.fallbackVariant})`} />
      </svg>

      {/* Bespoke Laboratory Ampoule & Salt Crystal Vector Illustration */}
      <svg viewBox="0 0 280 180" className="relative z-10 w-full max-w-[260px] h-auto drop-shadow-md" aria-hidden="true">
        {/* Slate pedestal */}
        <rect x="24" y="142" width="232" height="12" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        {/* Borosilicate glass ampoule */}
        <path
          d="M 48 92 L 154 92 C 166 92 174 100 182 104 L 204 108 C 208 109 208 115 204 116 L 182 120 C 174 124 166 132 154 132 L 48 132 C 36 132 30 124 30 112 C 30 100 36 92 48 92 Z"
          fill="rgba(226, 232, 240, 0.14)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Metallic specimen chunks inside ampoule */}
        <polygon points="52,126 68,104 88,108 94,126" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
        <polygon points="90,126 104,102 124,107 132,126" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
        <polygon points="126,126 138,109 152,113 156,126" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
        {/* Subtle greenish-tint highlight for Pr */}
        <polygon points="68,104 88,108 82,118 60,118" fill={accentHex} opacity="0.28" />
        {/* Watch glass with green Pr3+ salt crystals */}
        <path d="M 192 135 Q 222 145 252 135" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="205,134 214,120 223,134" fill={accentHex} opacity="0.85" />
        <polygon points="217,135 226,116 236,135" fill={accentHex} opacity="0.95" />
        <polygon points="229,134 238,123 245,134" fill={accentHex} opacity="0.75" />
        {/* Ampoule label */}
        <text x="64" y="80" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="600">
          {atomicNumber} {symbol} · Ar 99.9%
        </text>
      </svg>

      <div className="relative z-10 mt-2 text-center">
        <span className="text-xs font-mono tracking-wide text-slate-300">
          {asset.isIllustrationNote[lang]}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <figure className={`group flex flex-col ${className}`}>
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          className={`relative w-full ${aspectClass} overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-zoom-in`}
          aria-label={`${asset.alt[lang]} — ${UI_TEXT.labels.zoomHint[lang]}`}
        >
          {hasImage ? (
            <img
              src={asset.imageUrl}
              alt={asset.alt[lang]}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            renderFallbackArtwork()
          )}
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-white opacity-90 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{UI_TEXT.labels.zoomHint[lang]}</span>
          </div>
        </button>

        <figcaption className="mt-2.5 space-y-0.5 text-sm leading-snug text-slate-700">
          <p className="font-medium text-slate-900">{asset.caption[lang]}</p>
          <p className="text-xs text-slate-500">{asset.isIllustrationNote[lang]}</p>
        </figcaption>
      </figure>

      {/* Lightbox Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={asset.alt[lang]}
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{asset.caption[lang]}</p>
                <p className="text-xs text-slate-400 truncate">{asset.isIllustrationNote[lang]}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs font-medium transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span>{UI_TEXT.labels.close[lang]}</span>
              </button>
            </div>
            <div className="relative w-full aspect-[4/3] max-h-[75vh] bg-slate-950 flex items-center justify-center">
              {hasImage ? (
                <img
                  src={asset.imageUrl}
                  alt={asset.alt[lang]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                renderFallbackArtwork()
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
