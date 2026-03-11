import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('CYSTECH 2K26 API')
    .setDescription('Vibranium-powered symposium backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const preferredPort = Number(process.env.PORT) || 3001;
  let activePort = preferredPort;

  try {
    await app.listen(activePort);
  } catch (error: any) {
    if (error?.code === 'EADDRINUSE') {
      activePort = preferredPort + 1;
      console.warn(`\n⚠ Port ${preferredPort} is already in use. Falling back to ${activePort}.\n`);
      await app.listen(activePort);
    } else {
      throw error;
    }
  }

  console.log(`\n🟣 CYSTECH API running on http://localhost:${activePort}/api`);
  console.log(`   Swagger docs: http://localhost:${activePort}/api/docs\n`);
}
bootstrap();
