import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { PaymentIntentDto } from './payment-intent.dto';
import { nanoid } from 'nanoid';
import { onlyForTestE2E } from '../../test/decorators/only-for-test-e2e.decorator';
import { creationalMethod } from '../../test/decorators/creational-method.decorator';
import { InMemoryHelper } from '../../test/helpers/in-memory.helper';
import { cleanableProvider } from '../../test/decorators/cleanable-provider.decorator';

@Injectable()
@cleanableProvider
export class PaymentIntentService {
  #collection: { doc: (string) => any; add: (any) => any };
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
    this.#collection = firebase.db.collection('payment-intent');
  }

  async getOne(paymentIntentId: string): Promise<PaymentIntentDto | undefined> {
    const ref = this.getOneRef(paymentIntentId);
    const doc = await ref.get();
    return doc.exists ? doc.data() : undefined;
  }

  @creationalMethod('id')
  async create(paymentIntent: PaymentIntentDto): Promise<PaymentIntentDto> {
    const paymentIntentId = `pay_intent_${nanoid()}`;
    await this.getOneRef(paymentIntentId).set({
      ...paymentIntent,
      id: paymentIntentId,
      createdAt: Date.now(),
    });
    return this.getOne(paymentIntentId);
  }

  async updateOne(
    paymentIntentId: string,
    paymentIntent: PaymentIntentDto,
  ): Promise<PaymentIntentDto | undefined> {
    if (paymentIntentId !== paymentIntent.id) {
      throw new UnprocessableEntityException(
        `Payment intent id (${paymentIntentId}) is different from the id in payment intent data (${paymentIntent.id})`,
      );
    }
    const ref = this.getOneRef(paymentIntentId);
    await ref.update({ ...paymentIntent });
    return this.getOne(paymentIntentId);
  }

  private getOneRef(paymentIntentId: string) {
    return this.#collection.doc(`${paymentIntentId}`);
  }

  // Only for E2E test
  @onlyForTestE2E
  private async deleteOne(paymentIntentId: string): Promise<void> {
    await this.#collection.doc(`${paymentIntentId}`).delete();
  }

  @onlyForTestE2E
  public async deleteDataAfterTest(): Promise<void> {
    console.log(
      InMemoryHelper.getInstance().getAllIdByType('PaymentIntentService'),
    );
    await Promise.all(
      InMemoryHelper.getInstance()
        .getAllIdByType('PaymentIntentService')
        .map((id) => this.deleteOne(id)),
    );
  }
}
