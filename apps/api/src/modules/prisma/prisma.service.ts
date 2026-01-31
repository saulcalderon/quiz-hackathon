import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // log:
      //   process.env.NODE_ENV === 'development'
      //     ? ['query', 'info', 'warn', 'error']
      //     : ['error'],
      // errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    try {
      const startTime = Date.now();
      await this.$connect();
      const connectionTime = Date.now() - startTime;
      this.logger.log(`Database connected in ${connectionTime}ms`);
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
