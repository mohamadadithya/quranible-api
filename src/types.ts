interface QuranData {
  license: string;
  source: string;
  audioEdition: string;
  data: Surah[];
}

interface Transliteration {
  en: string;
  id: string;
}

interface Verse {
  number: {
    inQuran: number;
    inSurah: number;
  };
  meta: {
    juz: number;
    page: number;
    manzil: number;
    ruku: number;
    hizbQuarter: number;
    sajda: {
      recommended: boolean;
      obligatory: boolean;
    };
  };
  text: {
    arab: string;
    transliteration: string;
  };
  translation: Transliteration;
  audio: {
    primary: string;
    secondary: string[];
  };
  tafsir: {
    id: {
      short: string;
      long: string;
    };
  };
}

interface Surah {
  number: number;
  sequence: number;
  numberOfVerses: number;
  name: {
    short: string;
    long: string;
    transliteration: Transliteration;
    translation: Transliteration;
  };
  revelation: {
    arab: string;
    en: string;
    id: string;
  };
  tafsir: {
    id: string;
  };
  preBismillah?: string | null;
  verses?: Verse[];
  names?: string;
}

export type { QuranData, Surah };
