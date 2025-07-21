import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let server: any;

async function createExpressServer() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.enableCors();
  app.setGlobalPrefix('');

  const config = new DocumentBuilder()
    .setTitle('Flow Test API')
    .setDescription('API for testing backend flow functionalities')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return expressApp;
}

export const handler = async (event: any, context: any) => {
  if (!server) {
    const expressApp = await createExpressServer();
    server = serverlessExpress({ app: expressApp });
  }
  return server(event, context);
};

if (process.env.NODE_ENV !== 'production' && process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  createExpressServer().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port);
  });
}
