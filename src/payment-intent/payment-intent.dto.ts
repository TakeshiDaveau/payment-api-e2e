type Currency = 'EUR' | 'USD' | 'GBP';
type PaymentMethod = 'card' | 'paypal' | 'applepay' | 'googlepay';
type PaymentIntentStatus = 'in_progress' | 'failed' | 'succeeded';
type Timestamp = number;

export class PaymentIntentDto {
  id: string;
  status: PaymentIntentStatus;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, string>;
  createdAt: Timestamp;
}
