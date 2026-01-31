import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const startTime = Date.now();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    rawBody: true, // Necesario para webhooks de Stripe
  });

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const bootTime = Date.now() - startTime;
  console.log(`✅ Application started in ${bootTime}ms on port ${port}`);
}
void bootstrap();
