import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  try{
    const app = await NestFactory.createMicroservice(AppModule, {
      transport: Transport.RMQ,
      options: { 
           urls: ['amqp://myuser:mypassword@localhost:5672'],
           queue: 'user-messages',
           queueOptions: { 
              durable: true
             },
            },
    });
    await app.listen();
  }catch(err){
    console.log(err)
  }
}
bootstrap();
