import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { PaymentIntentDto } from './payment-intent.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class PaymentIntentService {
  #collection: { doc: (string) => any; add: (any) => any };
  constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
    this.#collection = firebase.db.collection('payment-intent');
  }
  async getOne(paymentIntentId: string): Promise<PaymentIntentDto | undefined> {
    const ref = this.#getOneRef(paymentIntentId);
    const doc = await ref.get();
    return doc.exists ? doc.data() : undefined;
  }

  async create(paymentIntent: PaymentIntentDto): Promise<PaymentIntentDto> {
    const paymentIntentId = `pay_intent_${nanoid()}`;
    await this.#getOneRef(paymentIntentId).set({
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
    const ref = this.#getOneRef(paymentIntentId);
    await ref.update({ ...paymentIntent });
    return this.getOne(paymentIntentId);
  }

  // Do not use this method as it's not authorized to remove a PaymentIntent
  async deleteOne(paymentIntentId: string): Promise<void> {
    await this.#collection.doc(`${paymentIntentId}`).delete();
  }

  #getOneRef(paymentIntentId: string) {
    return this.#collection.doc(`${paymentIntentId}`);
  }
}
