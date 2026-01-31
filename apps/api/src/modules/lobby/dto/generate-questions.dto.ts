import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const GenerateQuestionsSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  notes: z.string().optional(),
});

export class GenerateQuestionsDto extends createZodDto(GenerateQuestionsSchema) {}
