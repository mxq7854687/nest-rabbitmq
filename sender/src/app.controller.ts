import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from './message.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('HELLO_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/produce')
  async produce(@Body() message: string): Promise<string> {
    await this.client.emit<any>('message_printed', new Message(message));
    console.log('sendding message');
    return 'Hello World printed';
  }

  @Post('/sum')
  async sum(@Body() data: number[]): Promise<any> {
    const resp = await this.client.send<any>('sum', data || []);
    return resp;
  }
}
