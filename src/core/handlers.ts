import quran from "@data/quran.json";
import type { QuranData, Surah } from "@types";

const { data } = quran as QuranData;

const getSurahs = () => {
  const surahs = data.map((item) => {
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
  const surah = data.find((item) => item.number === id);
  return surah as Surah;
};

const getSurahsByKeyword = (keyword: string) => {
  const rawSurahs = data.map((item) => {
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

export { getSurahs, getSurahById, getSurahsByKeyword, getAyahFromSurah };
