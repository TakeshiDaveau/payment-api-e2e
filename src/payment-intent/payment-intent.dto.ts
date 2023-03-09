import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}
export enum PaymentIntentStatus {
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}
export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  APPLEPAY = 'applepay',
  GOOGLEPAY = 'googlepay',
}
export type Timestamp = number;

export class PaymentIntentDto {
  @IsString()
  @IsOptional()
  @Allow()
  @ApiProperty()
  id?: string;

  @IsEnum(PaymentIntentStatus)
  @Allow()
  @IsNotEmpty()
  @ApiProperty({
    enum: PaymentIntentStatus,
  })
  status: PaymentIntentStatus;

  @Allow()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;

  @Allow()
  @IsEnum(Currency)
  @IsNotEmpty()
  @ApiProperty({
    enum: Currency,
  })
  currency: Currency;

  @Allow()
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  @ApiProperty({
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Allow()
  @IsOptional()
  @ApiProperty()
  metadata?: Record<string, string>;

  @ApiProperty()
  createdAt?: Timestamp;
}
