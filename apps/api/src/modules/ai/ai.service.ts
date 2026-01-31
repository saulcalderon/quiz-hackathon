import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';
import { Question, QuestionSet } from '../../common/types/question.types';

const QUESTION_COUNT = 5;
const MAX_NOTES_LENGTH = 1500; // Limit notes to reduce token usage

const questionSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      text: {
        type: SchemaType.STRING,
        description: 'The question text',
      },
      options: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Exactly 4 answer options',
      },
      correctIndex: {
        type: SchemaType.NUMBER,
        description: 'Index of the correct answer (0-3)',
      },
      difficulty: {
        type: SchemaType.STRING,
        format: 'enum',
        enum: ['easy', 'medium', 'hard'],
        description: 'Question difficulty level',
      },
    },
    required: ['text', 'options', 'correctIndex', 'difficulty'],
  },
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not set - AI features will be unavailable');
    }
  }

  private getGenAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    return this.genAI;
  }

  async generateQuestions(topic: string, notes?: string): Promise<QuestionSet> {
    const model = this.getGenAI().getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: questionSchema,
      },
    });

    const prompt = this.buildPrompt(topic, notes);

    this.logger.log(`Generating questions for topic: ${topic}`);

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const questions = JSON.parse(text) as Question[];

      // Validate the questions
      this.validateQuestions(questions);

      this.logger.log(`Generated ${questions.length} questions`);

      return questions;
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 429) {
        this.logger.error('Gemini API rate limit exceeded');
        throw new Error('AI service is temporarily unavailable. Please try again in a few minutes.');
      }
      this.logger.error(`Failed to generate questions: ${err.message}`);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  private buildPrompt(topic: string, notes?: string): string {
    let prompt = `Generate ${QUESTION_COUNT} quiz questions about "${topic}".
Each question: 4 options, 1 correct (correctIndex 0-3), difficulty (easy/medium/hard).`;

    if (notes) {
      // Truncate notes to reduce token usage
      const truncatedNotes = notes.length > MAX_NOTES_LENGTH 
        ? notes.slice(0, MAX_NOTES_LENGTH) + '...' 
        : notes;
      prompt += `\n\nSource:\n${truncatedNotes}`;
    }

    return prompt;
  }

  private validateQuestions(questions: Question[]): void {
    if (questions.length < 1 || questions.length > QUESTION_COUNT + 2) {
      throw new Error(`Expected ~${QUESTION_COUNT} questions, got ${questions.length}`);
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.text || q.text.trim() === '') {
        throw new Error(`Question ${i} has empty text`);
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${i} must have exactly 4 options`);
      }

      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error(`Question ${i} has invalid correctIndex: ${q.correctIndex}`);
      }

      if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
        throw new Error(`Question ${i} has invalid difficulty: ${q.difficulty}`);
      }
    }
  }
}
