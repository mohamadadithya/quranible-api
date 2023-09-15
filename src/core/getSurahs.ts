import quran from "@data/quran.json";
import type { QuranData } from "@types";

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
    data: surahs,
  };
};

const getSurahById = (id: number) => {
  const surah = data.find((item) => item.number === id);
  return surah;
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

  return surahs;
};

export { getSurahs, getSurahById, getSurahsByKeyword };
