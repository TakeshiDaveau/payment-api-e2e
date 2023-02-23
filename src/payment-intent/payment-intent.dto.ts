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
  id?: string;

  @IsEnum(PaymentIntentStatus)
  @Allow()
  @IsNotEmpty()
  status: PaymentIntentStatus;

  @Allow()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Allow()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @Allow()
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @Allow()
  @IsOptional()
  metadata?: Record<string, string>;

  createdAt?: Timestamp;
}
