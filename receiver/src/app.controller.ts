import { Controller, Get, Post } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { from, Observable, of } from 'rxjs';
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

  @MessagePattern({ cmd: 'asyncSum' })
  async asyncSum(data: number[]): Promise<number> {
    return (data || []).reduce((a, b) => a + b);
  }

  @MessagePattern({ cmd: 'streamSum' })
  streamSum(data: number[]): Observable<number> {
    return of((data || []).reduce((a, b) => a + b));
  }

  @MessagePattern({ cmd: 'streaming' })
  streaming(data: number[]): Observable<number> {
    return from(data);
  }



  @EventPattern('notification')
  eventHandler(data: boolean) {
    console.log('notify');
  }
}
