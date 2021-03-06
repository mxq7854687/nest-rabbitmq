import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('message_printed')
  async handleMessagePrinted(data: Record<string, unknown>) {
    console.log(data.text);
  }

  @MessagePattern('sum')
  sum(data: number[]): number {
    console.log('ok');
    return data.reduce((a, b) => a + b, 0);
  }
}
