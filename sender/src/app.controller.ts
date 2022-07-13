import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { Message } from './message.event';
import {
  catchError,
  from,
  lastValueFrom,
  Observable,
  of,
  scan,
  throwError,
} from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('HELLO_SERVICE') private readonly client: ClientProxy,
  ) {}
  static IS_NOTIFIED = false;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/produce')
  async callproduce(@Body() message: string): Promise<string> {
    await this.client.emit<any>('message_printed', new Message(message));
    console.log('sendding message');
    return 'Hello World printed';
  }

  @Post('/sum')
  async callsum(@Body() data: number[]): Promise<any> {
    console.log('doing sumt');
    return this.client.send<any>('sum', data || []);
    // return 'hello';
  }

  @Post()
  @HttpCode(200)
  call(@Query('command') cmd, @Body() data: number[]): Observable<number> {
    return this.client.send<number>({ cmd }, data);
  }

  @Post('useFactory')
  @HttpCode(200)
  callWithClientUseFactory(
    @Query('command') cmd,
    @Body() data: number[],
  ): Observable<number> {
    return this.client.send<number>({ cmd }, data);
  }

  @Post('useClass')
  @HttpCode(200)
  callWithClientUseClass(
    @Query('command') cmd,
    @Body() data: number[],
  ): Observable<number> {
    return this.client.send<number>({ cmd }, data);
  }

  @Post('stream')
  @HttpCode(200)
  stream(@Body() data: number[]): Observable<number> {
    return this.client
      .send<number>({ cmd: 'streaming' }, data)
      .pipe(scan((a, b) => a + b));
  }

  @Post('concurrent')
  @HttpCode(200)
  concurrent(@Body() data: number[][]): Promise<boolean> {
    const send = async (tab: number[]) => {
      const expected = tab.reduce((a, b) => a + b);
      const result = await lastValueFrom(
        this.client.send<number>({ cmd: 'sum' }, tab),
      );

      return result === expected;
    };
    return data
      .map(async (tab) => send(tab))
      .reduce(async (a, b) => (await a) && b);
  }

  @Post('error')
  @HttpCode(200)
  serializeError(
    @Query('client') query: 'custom' | 'standard' = 'standard',
    @Body() body: Record<string, any>,
  ): Observable<boolean> {
    return this.client.send({ cmd: 'err' }, {}).pipe(
      catchError((err) => {
        return of(err instanceof RpcException);
      }),
    );
  }

  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
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

  @MessagePattern({ cmd: 'err' })
  throwAnError() {
    return throwError(() => new Error('err'));
  }

  @Post('notify')
  async sendNotification(): Promise<any> {
    return this.client.emit<number>('notification', true);
  }

  @EventPattern('notification')
  eventHandler(data: boolean) {
    AppController.IS_NOTIFIED = data;
  }
}
