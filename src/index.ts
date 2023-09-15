import { Elysia, NotFoundError } from "elysia";
import { getSurahById, getSurahs, getSurahsByKeyword } from "@core/getSurahs";
import { cors } from "@elysiajs/cors";
import { origins } from "@config";
import { Surah } from "@types";

const app = new Elysia().onError(({ code, set }) => {
  if (code === "NOT_FOUND") {
    set.status = 404;

    return {
      message: "Surahs not found",
      data: null,
    };
  }
});

const DEFAULT_PORT = 8080;

app.get("/", ({ set }) => {
  set.status = 200;

  return {
    meta: {
      status: 200,
      message: "Welcome to Quranible API by Mohamad Adithya",
    },
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

app
  .use(
    cors({
      origin: origins,
    })
  )
  .listen(Bun.env.PORT ?? DEFAULT_PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
