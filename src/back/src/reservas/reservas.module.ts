import { Module } from '@nestjs/common';
import { PagamentosController } from './pagamentos.controller.js';
import { PagamentosService } from './pagamentos.service.js';
import { FakePaymentGateway, PAYMENT_GATEWAY } from './payment-gateway.js';
import { ReservasController } from './reservas.controller.js';
import { ReservasService } from './reservas.service.js';

@Module({
  controllers: [ReservasController, PagamentosController],
  providers: [
    ReservasService,
    PagamentosService,
    { provide: PAYMENT_GATEWAY, useClass: FakePaymentGateway },
  ],
})
export class ReservasModule {}
