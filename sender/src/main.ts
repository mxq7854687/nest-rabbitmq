import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { retryAttempts: 5, retryDelay: 3000 },
  // });
  const options = new DocumentBuilder()
    .setTitle('App example')
    .setDescription('The app API description')
    .setVersion('1.0')
    .addTag('app')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
