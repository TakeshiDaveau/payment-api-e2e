import * as request from 'supertest';
import {
  badRequestPaymentIntentFixture,
  paymentIntentFixture,
} from './__fixtures__/payment-intent.fixture';
import { PaymentIntentService } from '../src/payment-intent/payment-intent.service';
import { nanoid } from 'nanoid';
import { PaymentIntentDto } from '../src/payment-intent/payment-intent.dto';
import { E2eHelper } from './helpers/e2e.helper';

describe('PaymentIntent (e2e)', () => {
  const baseUrl: Readonly<string> = 'payment_intent';
  const paymentIntentIds: string[] = [];
  const paymentIntentExpected: PaymentIntentDto = {
    paymentMethod: paymentIntentFixture.paymentMethod,
    currency: paymentIntentFixture.currency,
    createdAt: expect.any(Number),
    id: expect.any(String),
    status: paymentIntentFixture.status,
    amount: paymentIntentFixture.amount,
  };
  let e2eHelper: E2eHelper;
  let paymentIntentService: PaymentIntentService;

  beforeAll(async () => {
    e2eHelper = await E2eHelper.createTestingModule();

    paymentIntentService =
      e2eHelper.module.get<PaymentIntentService>(PaymentIntentService);
  });

  // Pas de données d'initialisations, mais pour un test plus réel pour
  // créer un payment intent il faudra probablement avoir :
  // - payment method
  // - customer
  afterAll(async () => {
    // On pourrait tout simplement supprimer la collection payment intent au complet.
    // J'utilise ici Firebase par simplicité, mais dans l'idée ce serait plutôt un Payment Service Provider
    await Promise.all(
      paymentIntentIds.map((paymentIntentId) =>
        paymentIntentService.deleteOne(paymentIntentId),
      ),
    );
  });

  describe('POST /payment_intent', () => {
    it('should create payment intent when request body is valid', async () => {
      const { body } = await request(e2eHelper.app.getHttpServer())
        .post(`/${baseUrl}`)
        .send(paymentIntentFixture)
        .expect(201);

      expect(body).toEqual(paymentIntentExpected);

      // TODO delete after cleanup use
      paymentIntentIds.push(body.id);
    });

    it('should return a 400 when request body contain invalid data', async () => {
      return request(e2eHelper.app.getHttpServer())
        .post(`/${baseUrl}`)
        .send(badRequestPaymentIntentFixture)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'status must be one of the following values: in_progress, failed, succeeded',
            'amount must be a positive number',
            'currency should not be empty',
            'currency must be one of the following values: EUR, USD, GBP',
            'paymentMethod must be one of the following values: card, paypal, applepay, googlepay',
          ],
          error: 'Bad Request',
        });
    });
  });

  describe('GET /payment_intent/:paymentIntentId', () => {
    let paymentIntentId: string;

    beforeAll(async () => {
      const result = await paymentIntentService.create(paymentIntentFixture);
      paymentIntentId = result.id;
      // TODO delete after cleanup use
      paymentIntentIds.push(paymentIntentId);
    });

    it('should return the payment intent when it exists', async () => {
      const { body } = await request(e2eHelper.app.getHttpServer())
        .get(`/${baseUrl}/${paymentIntentId}`)
        .expect(200);

      expect(body).toEqual(paymentIntentExpected);
    });
    it("should return a 404 when payment intent doesn't exist", () => {
      const id = nanoid();
      return request(e2eHelper.app.getHttpServer())
        .get(`/${baseUrl}/${id}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Payment intent with id ${id} not found`,
          error: 'Not Found',
        });
    });
  });

  describe('PUT /payment_intent/:paymentIntentId', () => {
    let paymentIntentId: string;
    let paymentIntentDifferentId: string;
    let paymentIntent: PaymentIntentDto;

    beforeAll(async () => {
      const result = await paymentIntentService.create(paymentIntentFixture);
      paymentIntentId = result.id;
      // TODO delete after cleanup use
      paymentIntentIds.push(paymentIntentId);

      paymentIntent = { ...paymentIntentFixture, id: paymentIntentId };

      const { id } = await paymentIntentService.create(paymentIntentFixture);
      paymentIntentDifferentId = id;
      // TODO delete after cleanup use
      paymentIntentIds.push(paymentIntentDifferentId);
    });

    it('should return the payment intent when it exists and body is valid', async () => {
      const { body } = await request(e2eHelper.app.getHttpServer())
        .put(`/${baseUrl}/${paymentIntentId}`)
        .send(paymentIntent)
        .expect(200);

      expect(body).toEqual(paymentIntentExpected);
    });
    it("should return a 404 when payment intent doesn't exist", () => {
      const id = nanoid();

      return request(e2eHelper.app.getHttpServer())
        .put(`/${baseUrl}/${id}`)
        .send(paymentIntent)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Payment intent with id ${id} not found`,
          error: 'Not Found',
        });
    });
    it('should return a 400 when request body contain invalid data', () => {
      return request(e2eHelper.app.getHttpServer())
        .put(`/${baseUrl}/${paymentIntentId}`)
        .send(badRequestPaymentIntentFixture)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'status must be one of the following values: in_progress, failed, succeeded',
            'amount must be a positive number',
            'currency should not be empty',
            'currency must be one of the following values: EUR, USD, GBP',
            'paymentMethod must be one of the following values: card, paypal, applepay, googlepay',
          ],
          error: 'Bad Request',
        });
    });
    it('should return a 422 when payment intent id in body is different from the one in param', () => {
      return request(e2eHelper.app.getHttpServer())
        .put(`/${baseUrl}/${paymentIntentDifferentId}`)
        .send(paymentIntent)
        .expect(422)
        .expect({
          statusCode: 422,
          message: `Payment intent id (${paymentIntentDifferentId}) is different from the id in payment intent data (${paymentIntent.id})`,
          error: 'Unprocessable Entity',
        });
    });
  });
});
