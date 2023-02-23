import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PaymentIntentService } from './payment-intent.service';

@Injectable()
export class PaymentIntentExistGuard implements CanActivate {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const paymentIntentId = request.params.paymentIntentId;
    return !!(await this.paymentIntentService.getOne(paymentIntentId));
  }
}
