import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

const registry = new OpenAPIRegistry();

extendZodWithOpenApi(z);

export { z, registry };
