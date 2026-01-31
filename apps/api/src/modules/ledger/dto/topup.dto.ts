import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TopupSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

export class TopupDto extends createZodDto(TopupSchema) {}
