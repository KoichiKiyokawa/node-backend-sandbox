import { z, ZodSchema } from "zod"
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"

export function createZodDto<T extends ZodSchema = ZodSchema>(schema: T) {
  class ZodDto {
    static schema = schema

    static create(input: unknown) {
      return schema.parse(input)
    }
  }

  return ZodDto as { new (): z.infer<T>; schema: T } & z.infer<T>
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const zodSchema = (metadata.metatype as ReturnType<typeof createZodDto>)
      ?.schema
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
