import { Context } from "hono";

type Options =
  | { private: true; maxAge: number }
  | { maxAge: number }
  | { sMaxAge: number }
  | { maxAge: number; sMaxAge: number };

export function setCacheControl(ctx: Context, options: Options) {
  ctx.res.headers.set(
    "Cache-Control",
    Object.entries(options)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join(", ")
  );
}
