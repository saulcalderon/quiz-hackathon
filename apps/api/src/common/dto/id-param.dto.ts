import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IdParamSchema = z.object({
  id: z.string().min(1, { message: 'ID cannot be empty' }),
});

export class IdParamDto extends createZodDto(IdParamSchema) {}
