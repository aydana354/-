import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import { ELEMENTS_LIST, ELEMENTS_MAP } from '../data/elementsIndex';
import { UI_TEXT } from '../data/uiTranslations';
import { ElementId, Language } from '../types/chemistry';
import { ResilientImage } from '../components/ResilientImage';
import { Atom3DViewer } from '../components/Atom3DViewer';
import { Atom2DShellExplorer } from '../components/Atom2DShellExplorer';
import { ReactionVisualizer } from '../components/ReactionVisualizer';
import { ElementQuiz } from '../components/ElementQuiz';

interface ElementDetailPageProps {
  elementId: ElementId;
  onNavigate: (path: string) => void;
  lang: Language;
}

export const ElementDetailPage: React.FC<ElementDetailPageProps> = ({
  elementId,
  onNavigate,
  lang,
}) => {
  const element = ELEMENTS_MAP[elementId];
  const [copiedRoute, setCopiedRoute] = React.useState(false);

  const currentIndex = ELEMENTS_LIST.findIndex((e) => e.id === elementId);
  const prevElement = currentIndex > 0 ? ELEMENTS_LIST[currentIndex - 1] : null;
  const nextElement =
    currentIndex < ELEMENTS_LIST.length - 1 ? ELEMENTS_LIST[currentIndex + 1] : null;

  const handleCopyPermanentLink = () => {
    const url = `${window.location.origin}/element/${element.id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedRoute(true);
    window.setTimeout(() => setCopiedRoute(false), 2000);
  };

  const sectionAnchors = [
    { id: 'sec-1', label: UI_TEXT.sections.s1[lang] },
    { id: 'sec-2', label: UI_TEXT.sections.s2[lang] },
    { id: 'sec-3', label: UI_TEXT.sections.s3[lang] },
    { id: 'sec-4', label: UI_TEXT.sections.s4[lang] },
    { id: 'sec-5', label: UI_TEXT.sections.s5[lang] },
    { id: 'sec-6', label: UI_TEXT.sections.s6[lang] },
    { id: 'sec-7', label: UI_TEXT.sections.s7[lang] },
    { id: 'sec-8', label: UI_TEXT.sections.s8[lang] },
    { id: 'sec-9', label: UI_TEXT.sections.s9[lang] },
    { id: 'sec-10', label: UI_TEXT.sections.s10[lang] },
    { id: 'sec-11', label: UI_TEXT.sections.s11[lang] },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div key={element.id} className="animate-fade-in">
      {/* Quick 5-Element Switcher Sub-Ribbon */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {ELEMENTS_LIST.map((el) => {
              const active = el.id === element.id;
              return (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => onNavigate(`/element/${el.id}`)}
                  style={active ? { backgroundColor: el.theme.accentHex } : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'text-white font-semibold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="font-mono mr-1 opacity-85">{el.atomicNumber}</span>
                  <span className="font-bold mr-1">{el.symbol}</span>
                  <span className="hidden sm:inline">{el.names[lang]}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopyPermanentLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 text-xs font-mono text-slate-700 transition-colors"
          >
            {copiedRoute ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>/element/{element.id}</span>
          </button>
        </div>
      </div>

      {/* Individual Element Hero Header with Custom Gradient */}
      <section className={`bg-gradient-to-br ${element.theme.gradientClass} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white/80">
                <span>Z = {element.atomicNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Ar = {element.atomicMassDisplay}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {UI_TEXT.labels.period[lang]} {element.period}
                </span>
                <span aria-hidden="true">·</span>
                <span>{element.groupDisplay[lang]}</span>
                <span aria-hidden="true">·</span>
                <span>{element.block}-block</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
                {element.names[lang]} ({element.symbol})
                <span className="block text-lg sm:text-2xl font-semibold text-white/85 mt-1">
                  {element.names.en} · {element.names.la}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                {element.summary[lang]}
              </p>
            </div>

            {/* Element Periodic Tile */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="w-full max-w-[260px] rounded-2xl bg-slate-950/35 border border-white/25 p-5 text-white">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-2xl font-bold tabular-nums">{element.atomicNumber}</span>
                  <span className="font-mono text-sm tabular-nums text-white/85">
                    {element.atomicMassDisplay}
                  </span>
                </div>
                <div className="my-3 font-display text-6xl font-extrabold tracking-tight leading-none">
                  {element.symbol}
                </div>
                <div className="text-base font-semibold">{element.names[lang]}</div>
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between font-mono text-xs text-white/85">
                  <span>{element.atomicStructure.electronConfigShort}</span>
                  <span>{element.atomicStructure.primaryOxidationState}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Section Index */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Horizontal Scrollable Section Navigation */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-slate-200">
            {sectionAnchors.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-14">
          {/* SECTION 1: General Characteristics */}
          <section id="sec-1" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s1[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <dl className="divide-y divide-slate-100 text-sm">
                  <DataRow label={UI_TEXT.labels.kzName[lang]} value={element.names.kz} />
                  <DataRow label={UI_TEXT.labels.ruName[lang]} value={element.names.ru} />
                  <DataRow label={UI_TEXT.labels.enName[lang]} value={element.names.en} />
                  <DataRow label={UI_TEXT.labels.laName[lang]} value={element.names.la} />
                  <DataRow label={UI_TEXT.labels.symbol[lang]} value={element.symbol} mono />
                  <DataRow label={UI_TEXT.labels.atomicNumber[lang]} value={String(element.atomicNumber)} mono />
                  <DataRow label={UI_TEXT.labels.atomicMass[lang]} value={element.atomicMassDisplay} mono />
                  <DataRow label={UI_TEXT.labels.period[lang]} value={String(element.period)} mono />
                  <DataRow label={UI_TEXT.labels.group[lang]} value={element.groupDisplay[lang]} />
                  <DataRow label={UI_TEXT.labels.block[lang]} value={`${element.block}-block`} mono />
                  <DataRow label={UI_TEXT.labels.elementType[lang]} value={element.elementType[lang]} />
                  <DataRow label={UI_TEXT.labels.category[lang]} value={element.category[lang]} />
                </dl>

                {element.blockNote && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs leading-relaxed text-slate-700">
                    {element.blockNote[lang]}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <ResilientImage
                  asset={element.visuals.pureSample}
                  symbol={element.symbol}
                  atomicNumber={element.atomicNumber}
                  accentHex={element.theme.accentHex}
                  lang={lang}
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Atomic Structure (3D Model + 2D Shells + Nucleus) */}
          <section id="sec-2" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s2[lang]} accentHex={element.theme.accentHex} />

            {/* Atomic Parameters Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard
                label={UI_TEXT.labels.protons[lang]}
                value={String(element.atomicStructure.protons)}
                accentHex={element.theme.accentHex}
              />
              <MetricCard
                label={UI_TEXT.labels.electrons[lang]}
                value={String(element.atomicStructure.electrons)}
                accentHex={element.theme.accentHex}
              />
              <MetricCard
                label={`${UI_TEXT.labels.neutrons[lang]} (${element.atomicStructure.featuredIsotope.massNumber}${element.symbol})`}
                value={String(element.atomicStructure.featuredIsotope.neutrons)}
                accentHex={element.theme.accentHex}
              />
              <MetricCard
                label={UI_TEXT.labels.nuclearCharge[lang]}
                value={element.atomicStructure.nuclearCharge}
                accentHex={element.theme.accentHex}
              />
            </div>

            {/* Electron Configuration & Oxidation States */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.electronConfig[lang]}</p>
                  <p className="font-mono text-xl font-bold text-slate-900 mt-0.5">
                    {element.atomicStructure.electronConfigShort}
                  </p>
                  <p className="font-mono text-xs text-slate-500 mt-1 break-words">
                    {element.atomicStructure.electronConfigFull}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.shellDistribution[lang]}</p>
                  <p className="font-mono text-base font-semibold tabular-nums text-slate-800 mt-0.5">
                    {element.atomicStructure.shells.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.valenceElectrons[lang]}</p>
                  <p className="font-mono text-base font-bold text-slate-900 mt-0.5">
                    {element.atomicStructure.valenceElectronsCount} e⁻
                  </p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {element.atomicStructure.valenceElectronsNote[lang]}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.oxidationStates[lang]}</p>
                  <p className="font-mono text-base font-bold mt-0.5" style={{ color: element.theme.accentHex }}>
                    {element.atomicStructure.oxidationStates.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Three.js 3D Atom Model */}
            <div className="space-y-2">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {UI_TEXT.atomModel.tab3D[lang]} — {element.names[lang]} ({element.symbol})
              </h3>
              <Atom3DViewer element={element} lang={lang} />
            </div>

            {/* Interactive 2D Electron Shells + Atomic Nucleus & Isotope Inspector */}
            <Atom2DShellExplorer element={element} lang={lang} />
          </section>

          {/* SECTION 3: Physical Properties */}
          <section id="sec-3" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s3[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <dl className="divide-y divide-slate-100 text-sm">
                  <DataRow label={UI_TEXT.labels.state[lang]} value={element.physicalProperties.stateAt298K[lang]} />
                  <DataRow label={UI_TEXT.labels.color[lang]} value={element.physicalProperties.color[lang]} />
                  <DataRow label={UI_TEXT.labels.appearance[lang]} value={element.physicalProperties.appearance[lang]} />
                  <DataRow label={UI_TEXT.labels.density[lang]} value={element.physicalProperties.densityDisplay[lang]} mono />
                  <DataRow
                    label={UI_TEXT.labels.meltingPoint[lang]}
                    value={`${element.physicalProperties.meltingPointC} °C (${element.physicalProperties.meltingPointK} K)`}
                    mono
                  />
                  <DataRow
                    label={UI_TEXT.labels.boilingPoint[lang]}
                    value={`${element.physicalProperties.boilingPointC} °C (${element.physicalProperties.boilingPointK} K)`}
                    mono
                  />
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <dl className="divide-y divide-slate-100 text-sm">
                  <DataRow label={UI_TEXT.labels.hardness[lang]} value={element.physicalProperties.hardnessMohs[lang]} />
                  <DataRow label={UI_TEXT.labels.electricalConductivity[lang]} value={element.physicalProperties.electricalConductivity[lang]} />
                  <DataRow label={UI_TEXT.labels.thermalConductivity[lang]} value={element.physicalProperties.thermalConductivity[lang]} mono />
                  <DataRow label={UI_TEXT.labels.magnetic[lang]} value={element.physicalProperties.magneticProperties[lang]} />
                  <DataRow label={UI_TEXT.labels.crystal[lang]} value={element.physicalProperties.crystalStructure[lang]} />
                  <DataRow
                    label={lang === 'kz' ? 'Атомдық радиус / Электртерістілік' : 'Радиус атома / Электроотрицательность'}
                    value={`${element.physicalProperties.atomicRadiusPm} pm · χ = ${element.physicalProperties.electronegativityPauling}`}
                    mono
                  />
                </dl>
              </div>
            </div>
          </section>

          {/* SECTION 4: Chemical Properties & Animated Reactions */}
          <section id="sec-4" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s4[lang]} accentHex={element.theme.accentHex} />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{UI_TEXT.labels.reactivity[lang]}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {element.chemicalProperties.reactivityOverview[lang]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <InfoBlock label={UI_TEXT.labels.withOxygen[lang]} text={element.chemicalProperties.withOxygen[lang]} />
                <InfoBlock label={UI_TEXT.labels.withWater[lang]} text={element.chemicalProperties.withWater[lang]} />
                <InfoBlock label={UI_TEXT.labels.withAcids[lang]} text={element.chemicalProperties.withAcids[lang]} />
                <InfoBlock label={UI_TEXT.labels.withOthers[lang]} text={element.chemicalProperties.withOtherElements[lang]} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <InfoBlock
                  label={UI_TEXT.labels.oxidationStates[lang]}
                  text={element.chemicalProperties.oxidationStatesExplanation[lang]}
                />
                <InfoBlock
                  label={lang === 'kz' ? 'Тән химиялық қосылыстары' : 'Характерные химические соединения'}
                  text={element.chemicalProperties.characteristicCompoundsSummary[lang]}
                  mono
                />
              </div>
            </div>

            <ReactionVisualizer
              reactions={element.chemicalProperties.reactions}
              symbol={element.symbol}
              accentHex={element.theme.accentHex}
              lang={lang}
            />
          </section>

          {/* SECTION 5: Natural Occurrence & Minerals */}
          <section id="sec-5" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s5[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                <InfoBlock label={UI_TEXT.labels.whereFound[lang]} text={element.naturalOccurrence.whereFound[lang]} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-2">{UI_TEXT.labels.minerals[lang]}</h4>
                    <ul className="space-y-1.5 text-sm text-slate-800 list-disc list-inside">
                      {element.naturalOccurrence.mainMinerals[lang].map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-2">
                      {UI_TEXT.labels.naturalCompounds[lang]}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-slate-800 list-disc list-inside">
                      {element.naturalOccurrence.naturalCompounds[lang].map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <InfoBlock label={UI_TEXT.labels.deposits[lang]} text={element.naturalOccurrence.deposits[lang]} />
                  <InfoBlock
                    label={UI_TEXT.labels.extraction[lang]}
                    text={element.naturalOccurrence.industrialExtraction[lang]}
                  />
                  <InfoBlock
                    label={UI_TEXT.labels.abundance[lang]}
                    text={element.naturalOccurrence.crustalAbundance[lang]}
                    mono
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <ResilientImage
                  asset={element.visuals.mineral}
                  symbol={element.symbol}
                  atomicNumber={element.atomicNumber}
                  accentHex={element.theme.accentHex}
                  lang={lang}
                />
              </div>
            </div>
          </section>

          {/* SECTION 6: Applications */}
          <section id="sec-6" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s6[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <ResilientImage
                  asset={element.visuals.application}
                  symbol={element.symbol}
                  atomicNumber={element.atomicNumber}
                  accentHex={element.theme.accentHex}
                  lang={lang}
                />
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ApplicationCard title={UI_TEXT.labels.industry[lang]} body={element.applications.industry[lang]} />
                <ApplicationCard title={UI_TEXT.labels.medicine[lang]} body={element.applications.medicine[lang]} />
                <ApplicationCard title={UI_TEXT.labels.electronics[lang]} body={element.applications.electronics[lang]} />
                <ApplicationCard title={UI_TEXT.labels.energy[lang]} body={element.applications.energy[lang]} />
                <ApplicationCard title={UI_TEXT.labels.science[lang]} body={element.applications.science[lang]} />
                <ApplicationCard title={UI_TEXT.labels.everyday[lang]} body={element.applications.everydayLife[lang]} />
                <div className="sm:col-span-2">
                  <ApplicationCard title={UI_TEXT.labels.modernTech[lang]} body={element.applications.modernTech[lang]} />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: Health & Ecology */}
          <section id="sec-7" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s7[lang]} accentHex={element.theme.accentHex} />

            {element.healthAndEcology.specialSafetyHighlight && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-display font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>{element.healthAndEcology.specialSafetyHighlight.title[lang]}</span>
                </div>
                <p className="text-sm text-amber-950/90 leading-relaxed">
                  {element.healthAndEcology.specialSafetyHighlight.content[lang]}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoBlock label={UI_TEXT.labels.biologicalRole[lang]} text={element.healthAndEcology.biologicalRole[lang]} />
                <InfoBlock label={UI_TEXT.labels.humanImpact[lang]} text={element.healthAndEcology.humanImpact[lang]} />
                <InfoBlock label={UI_TEXT.labels.toxicity[lang]} text={element.healthAndEcology.toxicityAndRisks[lang]} />
                <InfoBlock label={UI_TEXT.labels.plantsAnimals[lang]} text={element.healthAndEcology.plantsAndAnimals[lang]} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <InfoBlock label={UI_TEXT.labels.ecology[lang]} text={element.healthAndEcology.ecologicalConsequences[lang]} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2.5">
                  <ShieldCheck className="w-4 h-4" style={{ color: element.theme.accentHex }} />
                  <span>{UI_TEXT.labels.safety[lang]}</span>
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {element.healthAndEcology.safeHandlingRules[lang].map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400 mt-0.5 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 8: Discovery History */}
          <section id="sec-8" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s8[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.discoverer[lang]}</p>
                    <p className="text-base font-semibold text-slate-900 mt-0.5">
                      {element.discovery.discoverers[lang]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{UI_TEXT.labels.discoveryYear[lang]}</p>
                    <p className="font-mono text-xl font-bold tabular-nums text-slate-900 mt-0.5">
                      {element.discovery.year}
                    </p>
                  </div>
                </div>

                <InfoBlock label={UI_TEXT.labels.discoveryStory[lang]} text={element.discovery.historyStory[lang]} />
                <InfoBlock label={UI_TEXT.labels.etymology[lang]} text={element.discovery.etymology[lang]} />
                <InfoBlock label={UI_TEXT.labels.significance[lang]} text={element.discovery.scientificSignificance[lang]} />
              </div>

              {/* Historical Archive Portrait Card */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-slate-300" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-slate-400">
                      {element.discovery.scientistLifespan}
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mt-1">
                      {element.discovery.discoverers[lang]}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {element.discovery.scientistPortraitNote[lang]}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800 font-mono text-xs text-slate-400">
                  {element.atomicNumber} {element.symbol} · {element.discovery.year}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: Interesting Facts */}
          <section id="sec-9" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s9[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {element.interestingFacts[lang].map((fact, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-bold tabular-nums"
                      style={{ color: element.theme.accentHex }}
                    >
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10: Chemical Compounds */}
          <section id="sec-10" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s10[lang]} accentHex={element.theme.accentHex} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {element.compounds.map((comp) => (
                <article
                  key={comp.formula}
                  className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-display text-lg font-bold text-slate-900">
                        {comp.name[lang]}
                      </h4>
                    </div>
                    <span
                      className="px-3 py-1 rounded-lg font-mono text-sm font-bold text-white shrink-0"
                      style={{ backgroundColor: element.theme.accentHex }}
                    >
                      {comp.formula}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <InfoBlock label={UI_TEXT.labels.physProps[lang]} text={comp.physicalProperties[lang]} />
                    <InfoBlock label={UI_TEXT.labels.chemProps[lang]} text={comp.chemicalProperties[lang]} />
                    <InfoBlock label={UI_TEXT.labels.occurrence[lang]} text={comp.occurrence[lang]} />
                    <InfoBlock label={UI_TEXT.labels.apps[lang]} text={comp.applications[lang]} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SECTION 11: Interactive 10-Question Quiz */}
          <section id="sec-11" className="scroll-mt-24 space-y-6">
            <SectionHeading title={UI_TEXT.sections.s11[lang]} accentHex={element.theme.accentHex} />

            <ElementQuiz
              questions={element.quiz}
              title={`${element.atomicNumber} ${element.symbol} — ${element.names[lang]}`}
              accentHex={element.theme.accentHex}
              lang={lang}
            />
          </section>

          {/* Next / Previous Element Navigation */}
          <nav className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {prevElement ? (
              <button
                type="button"
                onClick={() => onNavigate(`/element/${prevElement.id}`)}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-colors text-left"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs text-slate-500">
                    {lang === 'kz' ? 'Алдыңғы элемент' : 'Предыдущий элемент'}
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900">
                    {prevElement.atomicNumber} {prevElement.symbol} — {prevElement.names[lang]}
                  </div>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextElement && (
              <button
                type="button"
                onClick={() => onNavigate(`/element/${nextElement.id}`)}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-400 transition-colors text-right"
              >
                <div>
                  <div className="text-xs text-slate-500">
                    {lang === 'kz' ? 'Келесі элемент' : 'Следующий элемент'}
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900">
                    {nextElement.atomicNumber} {nextElement.symbol} — {nextElement.names[lang]}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{ title: string; accentHex: string }> = ({ title, accentHex }) => (
  <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
  </div>
);

const DataRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono = false,
}) => (
  <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline">
    <dt className="sm:col-span-5 text-slate-500 font-medium">{label}</dt>
    <dd className={`sm:col-span-7 text-slate-900 font-semibold ${mono ? 'font-mono tabular-nums' : ''}`}>
      {value}
    </dd>
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; accentHex: string }> = ({
  label,
  value,
  accentHex,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-mono text-2xl font-bold tabular-nums mt-1" style={{ color: accentHex }}>
      {value}
    </p>
  </div>
);

const InfoBlock: React.FC<{ label: string; text: string; mono?: boolean }> = ({
  label,
  text,
  mono = false,
}) => (
  <div>
    <h4 className="text-xs font-semibold text-slate-500 mb-1">{label}</h4>
    <p className={`text-sm text-slate-800 leading-relaxed ${mono ? 'font-mono' : ''}`}>{text}</p>
  </div>
);

const ApplicationCard: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
    <h4 className="font-display text-sm font-bold text-slate-900">{title}</h4>
    <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
  </div>
);
