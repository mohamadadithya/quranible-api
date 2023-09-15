import { Elysia, NotFoundError } from "elysia";
import {
  getAyahFromSurah,
  getJuzById,
  getSurahById,
  getSurahs,
  getSurahsByKeyword,
} from "@core/handlers";
import { cors } from "@elysiajs/cors";
import { Surah } from "@types";
import { DEFAULT_PORT, ORIGINS } from "@config";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Quranible API",
          version: "1.0.0",
        },
      },
    })
  )
  .onError(({ code, set }) => {
    set.headers["Cache-Control"] =
      "public, max-age=0, s-maxage=86400, stale-while-revalidate";

    if (code === "NOT_FOUND") {
      set.status = 404;

      return {
        message: "Surahs/ayahs/juz not found",
        data: null,
      };
    }
  });

app.get("/", ({ set }) => {
  set.status = 200;

  return {
    meta: {
      status: 200,
      message: "Welcome to Quranible API by Mohamad Adithya",
    },
    routes: {
      surah: {
        all: "/surahs",
        byId: "/surahs/:id",
        byKeyword: "/surahs/:keyword",
      },
      ayah: {
        bySurahId: "/surahs/:id/ayahs/:id",
      },
      juz: {
        byId: "/juz/:id",
      },
    },
    source: "https://github.com/mohamadadithya/quranible-api",
  };
});

app.get("/surahs", ({ set }) => {
  set.status = 200;

  const surahs = getSurahs();

  return {
    meta: {
      message: "All Surahs retrieved successfully",
      total: surahs.total,
      data: surahs.data,
    },
  };
});

app.get("/surahs/:id", ({ set, params }) => {
  const { id: surahId } = params;
  const surah = getSurahById(Number(surahId)) as Surah;

  if (surah) {
    set.status = 200;

    return {
      meta: {
        message: `Surah retrieved successfully`,
      },
      data: surah,
    };
  } else {
    throw new NotFoundError();
  }
});

app.get("/surahs/search/:keyword", ({ set, params }) => {
  const { keyword } = params;
  const filteredSurahs = getSurahsByKeyword(keyword);

  if (filteredSurahs.length > 0) {
    set.status = 200;

    return {
      meta: {
        message: `Surahs retrieved successfully`,
      },
      data: filteredSurahs,
    };
  } else {
    throw new NotFoundError();
  }
});

app.get("/surahs/:id/ayahs/:ayahId", ({ set, params }) => {
  const { id: surahId, ayahId } = params;
  const ayah = getAyahFromSurah(Number(surahId), Number(ayahId));

  if (ayah) {
    set.status = 200;

    return {
      meta: {
        message: "Ayah retrieved successfully",
      },
      data: ayah,
    };
  } else {
    throw new NotFoundError();
  }
});

app.get("/juz/:juzId", ({ set, params }) => {
  const { juzId } = params;
  const juz = getJuzById(Number(juzId));

  if (juz) {
    set.status = 200;

    return {
      meta: {
        message: "Juz retrieved successfully",
      },
      data: juz,
    };
  } else {
    throw new NotFoundError();
  }
});

app.use(cors({ origin: ORIGINS })).listen(Bun.env.PORT ?? DEFAULT_PORT);

console.log(
  `Quranible API is running at ${app.server?.hostname}:${app.server?.port}`
);
