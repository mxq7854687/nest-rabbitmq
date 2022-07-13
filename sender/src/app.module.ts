import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'HELLO_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://myuser:mypassword@localhost:5672'],
    //       queue: 'user-messages',
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
    ClientsModule.register([
      { name: 'HELLO_SERVICE', transport: Transport.TCP },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
