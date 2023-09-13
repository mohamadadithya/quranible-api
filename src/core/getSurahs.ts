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

export { getSurahs };
