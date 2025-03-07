import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { PaginatedResult } from 'interface/paginated-result.interface'

import { OrdersService } from './orders.service'

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.orderService.paginate(page, ['order_items'])
  }

  @Post('expres')
  @HttpCode(HttpStatus.OK)
  async export(@Res() response: Response): Promise<any> {
    return this.orderService.export(response)
  }

  @Get('chart')
  @HttpCode(HttpStatus.OK)
  async chart(): Promise<{ date: string; sum: string }[]> {
    return this.orderService.chart()
  }
}
