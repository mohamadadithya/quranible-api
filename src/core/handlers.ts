import quran from "@data/quran.json";
import juz from "@data/juz.json";
import type { JuzData, QuranData, Surah, Verse } from "@types";

const { data: quranData } = quran as QuranData;
const { data: juzData } = juz as JuzData;

const getJuzById = (juzId: number) => {
  const juzMeta = juzData[juzId - 1];

  if (juzMeta) {
    const startSurah = juzMeta.start.index - 1;
    const startAyah = juzMeta.start.verse - 1;

    const endSurah = juzMeta.end.index - 1;
    const endAyah = juzMeta.end.verse;

    let juzAyahs: Verse[] = [],
      firstSurahVerses: Verse[] = [],
      middleSurah: Surah[] = [],
      middleSurahVerses: Verse[] = [],
      lastSurahVerses: Verse[] = [];

    const middleSurahId = endSurah - startSurah;

    if (startSurah === endSurah) {
      juzAyahs = quranData[startSurah].verses?.slice(
        startAyah,
        endAyah
      ) as Verse[];
    } else if (middleSurahId > 1) {
      firstSurahVerses = quranData[startSurah].verses?.slice(
        startAyah
      ) as Verse[];

      middleSurah = quranData.slice(startSurah + 1, endSurah);
      middleSurah.map((items) => {
        items.verses?.map((item) => middleSurahVerses.push(item));
      });

      lastSurahVerses = quranData[endSurah].verses?.slice(
        0,
        endAyah
      ) as Verse[];
      juzAyahs = [...firstSurahVerses, ...lastSurahVerses, ...lastSurahVerses];
    } else {
      firstSurahVerses = quranData[startSurah].verses?.slice(
        startAyah
      ) as Verse[];
      lastSurahVerses = quranData[endSurah].verses?.slice(
        0,
        endAyah
      ) as Verse[];
      juzAyahs = [...firstSurahVerses, ...lastSurahVerses] as Verse[];
    }

    const startSurahName = quranData[startSurah].name.transliteration.id;
    const endSurahName = quranData[endSurah].name.transliteration.id;

    const data = {
      juz: juzId,
      juz_start_surah_number: juzMeta.start.index,
      juz_end_surah_number: juzMeta.end.index,
      juz_start_info: {
        surah_name: startSurahName,
        verse_id: juzMeta.start.verse,
      },
      juz_end_info: {
        surah_name: endSurahName,
        verse_id: juzMeta.end.verse,
      },
      total_verses: juzAyahs.length,
      verses: juzAyahs,
    };

    return data;
  }
};

const getSurahs = () => {
  const surahs = quranData.map((item) => {
    const surah = { ...item };

    delete surah.verses;
    delete surah.preBismillah;

    return surah;
  });

  return {
    total: surahs.length,
    data: surahs as Surah[],
  };
};

const getSurahById = (id: number) => {
  const surah = quranData.find((item) => item.number === id);
  return surah as Surah;
};

const getSurahsByKeyword = (keyword: string) => {
  const rawSurahs = quranData.map((item) => {
    const names = [
      ...Object.values(item.name.translation),
      ...Object.values(item.name.transliteration),
    ]
      .map((name: string) => name.toLowerCase())
      .join(",");

    item.names = names;
    return item;
  });

  const surahs = rawSurahs.filter((item) =>
    item.names?.includes(keyword.toLowerCase())
  );

  return surahs as Surah[];
};

const getAyahFromSurah = (surahId: number, ayahId: number) => {
  const surah = getSurahById(surahId);

  if (surah) {
    const { verses } = surah;
    const ayah = verses?.find((verse) => verse.number.inSurah === ayahId);

    return ayah;
  }
};

export {
  getSurahs,
  getSurahById,
  getSurahsByKeyword,
  getAyahFromSurah,
  getJuzById,
};
