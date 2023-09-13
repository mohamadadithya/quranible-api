import { Elysia } from "elysia";
import { getSurahs } from "@core/getSurahs";
import { cors } from "@elysiajs/cors";
import { origins } from "@config";

const app = new Elysia();
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
      status: 200,
      message: "All Surahs",
      total: surahs.total,
      data: surahs.data,
    },
  };
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
