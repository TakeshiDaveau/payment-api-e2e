import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';
import { join } from 'path';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: join(process.cwd(), 'credentials.json'),
    }),
    PaymentIntentModule,
  ],
})
export class AppModule {}
