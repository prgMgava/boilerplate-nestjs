import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { useContainer } from 'class-validator';
import compression from 'compression';
import helmet from 'helmet';

import { shouldCompress } from '@core/compression';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import LoggerService from './logger/logger.service';
import { ErrorHandler, ResponseHandler } from './middlewares';
import validationOptions from './utils/validation-options';

import 'dotenv/config';

async function bootstrap() {
  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',') || ([] as string[]);
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: allowedOrigins,
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.use(
    compression({
      filter: shouldCompress,
      //threshold: 1024,
      threshold: 0,
    }),
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseHandler(),
  );
  app.useGlobalFilters(new ErrorHandler(app.get(LoggerService)));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
