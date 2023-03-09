import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PaymentIntentExistGuard } from './payment-intent-exist.guard';
import { PaymentIntentDto } from './payment-intent.dto';
import { PaymentIntentService } from './payment-intent.service';

@Controller('payment_intent')
export class PaymentIntentController {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}

  @Post('')
  @ApiBody({ type: PaymentIntentDto })
  @ApiOkResponse({
    description: 'Payment intent created',
    type: PaymentIntentDto,
  })
  @HttpCode(201)
  async create(
    @Body() paymentIntent: PaymentIntentDto,
  ): Promise<PaymentIntentDto> {
    return this.paymentIntentService.create(paymentIntent);
  }

  @Get(':paymentIntentId')
  @UseGuards(PaymentIntentExistGuard)
  @ApiOkResponse({
    description: 'Payment intent retrieved',
    type: PaymentIntentDto,
  })
  @HttpCode(200)
  getOne(
    @Param('paymentIntentId') paymentIntentId: string,
  ): Promise<PaymentIntentDto> {
    return this.paymentIntentService.getOne(paymentIntentId);
  }

  @Put(':paymentIntentId')
  @UseGuards(PaymentIntentExistGuard)
  @ApiBody({ type: PaymentIntentDto })
  @ApiOkResponse({
    description: 'Payment intent updated',
    type: PaymentIntentDto,
  })
  @HttpCode(200)
  updateOne(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() paymentIntent: PaymentIntentDto,
  ): Promise<PaymentIntentDto> {
    return this.paymentIntentService.updateOne(paymentIntentId, paymentIntent);
  }
}
