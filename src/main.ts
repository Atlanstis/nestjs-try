import { NestFactory } from '@nestjs/core';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  TransformInterceptor,
} from './common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { generateDocument } from './plugins';
import { getConfig } from './utils';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 统一响应体格式
  app.useGlobalInterceptors(new TransformInterceptor());
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  const { SWAGGER } = getConfig();
  if (SWAGGER && SWAGGER.enable) {
    // 创建文档
    generateDocument(app);
  }

  await app.listen(3000);
}

bootstrap();
