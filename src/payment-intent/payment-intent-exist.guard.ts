import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentIntentService } from './payment-intent.service';

/**
 * Guard to throw a not found exception when the payment intent
 * given as param in url (:paymentIntentId) does not exist.
 */
@Injectable()
export class PaymentIntentExistGuard implements CanActivate {
  constructor(private readonly paymentIntentService: PaymentIntentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const paymentIntentId = request.params.paymentIntentId;
    const paymentIntent = await this.paymentIntentService.getOne(
      paymentIntentId,
    );
    if (!paymentIntent) {
      throw new NotFoundException(
        `Payment intent with id ${paymentIntentId} not found`,
      );
    }
    return true;
  }
}
