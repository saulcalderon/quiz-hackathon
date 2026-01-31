import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SubmitAnswerSchema = z.object({
  questionIndex: z.number().int().min(0),
  selectedOption: z.number().int().min(0).max(3),
  responseTimeMs: z.number().int().min(0).max(60000),
});

export class SubmitAnswerDto extends createZodDto(SubmitAnswerSchema) {}
