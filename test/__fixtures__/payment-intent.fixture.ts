import {
  Currency,
  PaymentIntentDto,
  PaymentIntentStatus,
  PaymentMethod,
} from '../../src/payment-intent/payment-intent.dto';

export const paymentIntentFixture: Readonly<PaymentIntentDto> = {
  status: PaymentIntentStatus.IN_PROGRESS,
  amount: 1599,
  currency: Currency.EUR,
  paymentMethod: PaymentMethod.CARD,
};

export const badRequestPaymentIntentFixture: Readonly<
  Partial<PaymentIntentDto>
> = {
  status: 'wrong' as any,
  amount: -20,
  paymentMethod: 'wrong' as any,
};
