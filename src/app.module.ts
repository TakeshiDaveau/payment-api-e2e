import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: join(process.cwd(), 'credentials.json'),
    }),
    PaymentIntentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
