import { z, ZodSchema } from "zod"
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"

type CreateZodDtoResult<T extends ZodSchema<Record<string, unknown>>> = {
  new (): z.infer<T>
  schema: T
} & z.infer<T>

export function createZodDto<T extends ZodSchema<Record<string, unknown>>>(
  schema: T
): CreateZodDtoResult<T> {
  class ZodDto {
    static schema = schema

    static create(input: unknown) {
      return schema.parse(input)
    }
  }

  return ZodDto as unknown as CreateZodDtoResult<T>
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const zodSchema = (
      metadata.metatype as
        | CreateZodDtoResult<ZodSchema<Record<string, unknown>>>
        | undefined
    )?.schema
    if (zodSchema === undefined) return value

    const parseResult = zodSchema.safeParse(value)
    if (parseResult.success === false) {
      throw new Error(
        parseResult.error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ")
      )
    }

    return parseResult.data
  }
}
