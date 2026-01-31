import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateLobbySchema = z.object({
  entryFee: z.number().positive('Entry fee must be positive').min(1, 'Minimum entry fee is 1'),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  notes: z.string().optional(),
});

export class CreateLobbyDto extends createZodDto(CreateLobbySchema) {}
