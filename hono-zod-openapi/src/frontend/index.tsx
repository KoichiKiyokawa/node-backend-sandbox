import { hc } from "hono/client";

import { type AppType } from "..";

const client = hc<AppType>();
