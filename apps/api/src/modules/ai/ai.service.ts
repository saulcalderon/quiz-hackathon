import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';
import { Question, QuestionSet } from '../../common/types/question.types';

const QUESTION_COUNT = 10;

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
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: questionSchema,
      },
    });

    const prompt = this.buildPrompt(topic, notes);

    this.logger.log(`Generating questions for topic: ${topic}`);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const questions = JSON.parse(text) as Question[];

    // Validate the questions
    this.validateQuestions(questions);

    this.logger.log(`Generated ${questions.length} questions`);

    return questions;
  }

  private buildPrompt(topic: string, notes?: string): string {
    let prompt = `Generate exactly ${QUESTION_COUNT} multiple-choice trivia questions about: "${topic}"

Requirements:
- Each question must have exactly 4 answer options
- Only one option should be correct
- correctIndex must be 0, 1, 2, or 3
- Mix difficulties: 3 easy, 4 medium, 3 hard
- Questions should be challenging but fair
- Avoid trick questions
- Make distractors (wrong answers) plausible`;

    if (notes) {
      prompt += `

Use these study notes as the primary source for questions:
---
${notes}
---

Generate questions that test understanding of the key concepts from these notes.`;
    }

    return prompt;
  }

  private validateQuestions(questions: Question[]): void {
    if (questions.length !== QUESTION_COUNT) {
      throw new Error(`Expected ${QUESTION_COUNT} questions, got ${questions.length}`);
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
