export type Language = 'kz' | 'ru';

export type ElementId = 'ba' | 'la' | 'ce' | 'pr' | 'nd';

export interface BilingualText {
  kz: string;
  ru: string;
}

export interface BilingualList {
  kz: string[];
  ru: string[];
}

export interface ElementTheme {
  accentHex: string;
  accentDarkHex: string;
  accentLightHex: string;
  orbitColorHex: string;
  nucleusColorHex: string;
  gradientClass: string;
  textAccentClass: string;
  bgSoftClass: string;
  bgAccentClass: string;
  borderAccentClass: string;
  ringAccentClass: string;
}

export interface IsotopeInfo {
  massNumber: number;
  protons: number;
  electrons: number;
  neutrons: number;
  naturalAbundance: string;
  note: BilingualText;
}

export interface ReactionData {
  id: string;
  title: BilingualText;
  reactantType: 'oxygen' | 'water' | 'acid' | 'halogen' | 'other';
  equation: string;
  conditions: BilingualText;
  simpleExplanation: BilingualText;
  visualEffect: BilingualText;
}

export interface CompoundData {
  formula: string;
  name: BilingualText;
  physicalProperties: BilingualText;
  chemicalProperties: BilingualText;
  occurrence: BilingualText;
  applications: BilingualText;
}

export interface QuizQuestion {
  id: string;
  question: BilingualText;
  options: [BilingualText, BilingualText, BilingualText, BilingualText];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: BilingualText;
}

export interface ElementVisualAsset {
  imageUrl?: string;
  caption: BilingualText;
  alt: BilingualText;
  isIllustrationNote: BilingualText;
  fallbackVariant: 'sample' | 'mineral' | 'application';
}

export interface ElementData {
  id: ElementId;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  atomicMassDisplay: string;
  period: number;
  groupDisplay: BilingualText;
  block: 's' | 'd' | 'f';
  blockNote?: BilingualText;
  elementType: BilingualText;
  category: BilingualText;
  names: {
    kz: string;
    ru: string;
    en: string;
    la: string;
  };
  tagline: BilingualText;
  summary: BilingualText;
  theme: ElementTheme;

  // Section 2: Atomic Structure
  atomicStructure: {
    protons: number;
    electrons: number;
    nuclearCharge: string;
    featuredIsotope: IsotopeInfo;
    alternativeIsotopes: IsotopeInfo[];
    electronConfigShort: string;
    electronConfigFull: string;
    shells: number[];
    valenceElectronsCount: number;
    valenceElectronsNote: BilingualText;
    oxidationStates: string[];
    primaryOxidationState: string;
    orbitalFillingNote: BilingualText;
  };

  // Section 3: Physical Properties
  physicalProperties: {
    stateAt298K: BilingualText;
    color: BilingualText;
    appearance: BilingualText;
    densityGcm3: number;
    densityDisplay: BilingualText;
    meltingPointC: number;
    meltingPointK: number;
    boilingPointC: number;
    boilingPointK: number;
    hardnessMohs: BilingualText;
    electricalConductivity: BilingualText;
    thermalConductivity: BilingualText;
    magneticProperties: BilingualText;
    crystalStructure: BilingualText;
    atomicRadiusPm: number;
    electronegativityPauling: number;
  };

  // Section 4: Chemical Properties
  chemicalProperties: {
    reactivityOverview: BilingualText;
    withOxygen: BilingualText;
    withWater: BilingualText;
    withAcids: BilingualText;
    withOtherElements: BilingualText;
    oxidationStatesExplanation: BilingualText;
    characteristicCompoundsSummary: BilingualText;
    reactions: ReactionData[];
  };

  // Section 5: Natural Occurrence & Extraction
  naturalOccurrence: {
    whereFound: BilingualText;
    mainMinerals: BilingualList;
    naturalCompounds: BilingualList;
    deposits: BilingualText;
    industrialExtraction: BilingualText;
    crustalAbundance: BilingualText;
    crustalPpm: number;
  };

  // Section 6: Applications
  applications: {
    industry: BilingualText;
    medicine: BilingualText;
    electronics: BilingualText;
    energy: BilingualText;
    science: BilingualText;
    everydayLife: BilingualText;
    modernTech: BilingualText;
  };

  // Section 7: Health & Ecology
  healthAndEcology: {
    biologicalRole: BilingualText;
    humanImpact: BilingualText;
    toxicityAndRisks: BilingualText;
    specialSafetyHighlight?: {
      title: BilingualText;
      content: BilingualText;
    };
    plantsAndAnimals: BilingualText;
    ecologicalConsequences: BilingualText;
    safeHandlingRules: BilingualList;
  };

  // Section 8: Discovery History
  discovery: {
    discoverers: BilingualText;
    year: string;
    historyStory: BilingualText;
    etymology: BilingualText;
    scientificSignificance: BilingualText;
    scientistPortraitNote: BilingualText;
    scientistLifespan: string;
  };

  // Section 9: Interesting Facts (8-10 facts)
  interestingFacts: BilingualList;

  // Section 10: Chemical Compounds
  compounds: CompoundData[];

  // Section 11: Interactive Quiz (10 questions)
  quiz: QuizQuestion[];

  // Visual Assets
  visuals: {
    pureSample: ElementVisualAsset;
    mineral: ElementVisualAsset;
    application: ElementVisualAsset;
  };
}

export interface PeriodicElementCell {
  number: number;
  symbol: string;
  mass: string;
  nameKz: string;
  nameRu: string;
  period: number;
  group: number; // 1..18; for lanthanides/actinides grid placement, row 9/10 handles layout
  row: number; // 1..7, or 9 (lanthanides), 10 (actinides)
  col: number; // 1..18
  block: 's' | 'p' | 'd' | 'f';
  category:
    | 'alkali'
    | 'alkaline'
    | 'transition'
    | 'post-transition'
    | 'metalloid'
    | 'nonmetal'
    | 'noble'
    | 'lanthanide'
    | 'actinide';
  featuredId?: ElementId;
}
