import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaymentIntentExistGuard } from './payment-intent-exist.guard';
import { PaymentIntentDto } from './payment-intent.dto';
import { PaymentIntentService } from './payment-intent.service';

@Controller('payment-intent')
export class PaymentIntentController {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}

  @Post('')
  @HttpCode(201)
  @UseGuards(PaymentIntentExistGuard)
  create(@Body() paymentIntent: PaymentIntentDto): Promise<PaymentIntentDto> {
    return this.paymentIntentService.create(paymentIntent);
  }

  @Get(':paymentIntentId')
  @HttpCode(200)
  @UseGuards(PaymentIntentExistGuard)
  getOne(
    @Param('paymentIntentId') paymentIntentId: string,
  ): Promise<PaymentIntentDto> {
    return this.paymentIntentService.getOne(paymentIntentId);
  }

  @Put(':paymentIntentId')
  @HttpCode(200)
  @UseGuards(PaymentIntentExistGuard)
  updateOne(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() paymentIntent: PaymentIntentDto,
  ): Promise<PaymentIntentDto> {
    return this.paymentIntentService.updateOne(paymentIntentId, paymentIntent);
  }

  @Delete(':paymentIntentId')
  @HttpCode(204)
  @UseGuards(PaymentIntentExistGuard)
  deleteOne(@Param('paymentIntentId') paymentIntentId: string): Promise<void> {
    return this.paymentIntentService.deleteOne(paymentIntentId);
  }
}
